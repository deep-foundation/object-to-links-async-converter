import {
  DeepClient,
  SerialOperation,
  Table,
} from '@deep-foundation/deeplinks/imports/client';
import { BoolExpLink } from '@deep-foundation/deeplinks/imports/client_types';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';

async ({
  deep,
  data: { newLink: convertLink ,triggeredByLinkId},
}: {
  deep: DeepClient;
  data: { newLink: Link<number>, triggeredByLinkId: number};
}) => {
  const util = await import('util');
  const {capitalCase} = await import('case-anything');
  const {createSerialOperation} = await import('@deep-foundation/deeplinks/imports/gql/index')
  const logs: Array<any> = [];
  const DEFAULT_LOG_DEPTH = 3;
  try {
    const result = await main();
    return {
      result,
      logs,
    };
  } catch (error) {
    return {
      error,
      logs,
    };
  }

  type GetInsertSerialOperationsForStringOrNumberOptions = GetInsertSerialOperationsForAnyValueOptions & {
    value: string|number;
  }

  async function getInsertSerialOperationsForStringOrNumberValue(options: GetInsertSerialOperationsForStringOrNumberOptions) {
    const serialOperations: Array<SerialOperation> = [];
    const { name, value, linkId,  parentLinkId, containLinkId,containerLinkId } = options;
    const log = getNamespacedLogger({
      namespace: getInsertSerialOperationsForStringValue.name,
    });
    const linkInsertSerialOperation = createSerialOperation({
      type: 'insert',
      table: 'links',
      objects: {
        id: linkId,
        ...(parentLinkId && { from_id: parentLinkId, to_id: parentLinkId }),
        type_id: // TODO
      }
    })
    log({ linkInsertSerialOperation });
    serialOperations.push(linkInsertSerialOperation);
    const stringValueInsertSerialOperation = createSerialOperation({
      type: 'insert',
      table: `${typeof value}s` as Table<'insert'>,
      objects: {
        link_id: linkId,
        value: value
      }
    })
    log({ stringValueInsertSerialOperation });
    serialOperations.push(stringValueInsertSerialOperation);
    const containInsertSerialOperation = createSerialOperation({
      type: 'insert',
      table: 'links',
      objects: {
        id: containLinkId,
        from_id: containerLinkId,
        to_id: linkId
      }
    })
    log({ containInsertSerialOperation });
    serialOperations.push(containInsertSerialOperation);
    log({ serialOperations });
    return serialOperations;
  }

  type GetInsertSerialOperationsForStringOptions = GetInsertSerialOperationsForAnyValueOptions & {
    value: string;
  }

  async function getInsertSerialOperationsForStringValue(options: GetInsertSerialOperationsForStringOptions) {
    return getInsertSerialOperationsForStringOrNumberValue(options);
  }

  type GetInsertSerialOperationsForNumberOptions = GetInsertSerialOperationsForAnyValueOptions & {
    value: number;
  }

  async function getInsertSerialOperationsForNumberValue(options: GetInsertSerialOperationsForNumberOptions) {
    return getInsertSerialOperationsForStringOrNumberValue(options);
  }

  type GetInsertSerialOperationsForBooleanOptions = GetInsertSerialOperationsForAnyValueOptions & {
    value: boolean;
  } & {
    trueTypeLinkId: number;
    falseTypeLinkId: number;
  }

  async function getInsertSerialOperationsForBooleanValue(options: GetInsertSerialOperationsForBooleanOptions) {
    const serialOperations: Array<SerialOperation> = [];
    const { name, value, linkId,  parentLinkId, containLinkId,containerLinkId,falseTypeLinkId,trueTypeLinkId } = options;
    const log = getNamespacedLogger({
      namespace: getInsertSerialOperationsForStringValue.name,
    });
    const linkInsertSerialOperation = createSerialOperation({
      type: 'insert',
      table: 'links',
      objects: {
        id: linkId,
        ...(parentLinkId && { from_id: parentLinkId }),
        to_id: value ? trueTypeLinkId : falseTypeLinkId,
        type_id: // TODO
      }
    })
    log({ linkInsertSerialOperation });
    serialOperations.push(linkInsertSerialOperation);
    const containInsertSerialOperation = createSerialOperation({
      type: 'insert',
      table: 'links',
      objects: {
        id: containLinkId,
        from_id: containerLinkId,
        to_id: linkId
      }
    })
    log({ containInsertSerialOperation });
    serialOperations.push(containInsertSerialOperation);
    log({ serialOperations });
    return serialOperations;
  }

  type GetInsertSerialOperationsForObject = GetInsertSerialOperationsForAnyValueOptions & {
    value: object;
  }

  async function getInsertSerialOperationsForObject(options: GetInsertSerialOperationsForObject) {
    const serialOperations: Array<SerialOperation> = [];
    const { name, value, linkId,  parentLinkId, containLinkId,containerLinkId } = options;
    const log = getNamespacedLogger({
      namespace: getInsertSerialOperationsForStringValue.name,
    });
    const linkInsertSerialOperation = createSerialOperation({
      type: 'insert',
      table: 'links',
      objects: {
        id: linkId,
        ...(parentLinkId && { from_id: parentLinkId, to_id: parentLinkId }),
        type_id: // TODO
      }
    })
    log({ linkInsertSerialOperation });
    serialOperations.push(linkInsertSerialOperation);
    const objectValueInsertSerialOperation = createSerialOperation({
      type: 'insert',
      table: 'objects',
      objects: {
        link_id: linkId,
        value: value
      }
    })
    log({ objectValueInsertSerialOperation });
    serialOperations.push(objectValueInsertSerialOperation);
    const containInsertSerialOperation = createSerialOperation({
      type: 'insert',
      table: 'links',
      objects: {
        id: containLinkId,
        from_id: containerLinkId,
        to_id: linkId
      }
    })
    log({ containInsertSerialOperation });
    serialOperations.push(containInsertSerialOperation);
    log({ serialOperations });
    // TODO: Add operations for members
    return serialOperations;
  }

  type GetInsertSerialOperationsForAnyValueOptions = {
    value: string|number|object|boolean;
    parentLinkId: number|undefined;
    containLinkId: number;
    containerLinkId: number;
    name: string;
    linkId: number;
  } & {
    trueTypeLinkId: number;
    falseTypeLinkId: number;
  }

  async function getInsertSerialOperationsForAnyValue(options: GetInsertSerialOperationsForAnyValueOptions) { 
    const value = options.value;
    if(typeof value === 'string') {
      return await getInsertSerialOperationsForStringValue({
        ...options,
        value
      })
    } else if (typeof value === 'number') {
      return await getInsertSerialOperationsForNumberValue({
        ...options,
        value
      })
    } else if (typeof value === 'boolean') {
      return await getInsertSerialOperationsForBooleanValue({
        ...options,
        value,
      })
    } else if (typeof value === 'object') {
      return await getInsertSerialOperationsForObject({
        ...options,
        value
      })
    } else {
      throw new Error(`Unknown type of value ${value}: ${typeof value}. Only string, number, boolean and object are supported`)
    } 
  }


  async function main() {
    const log = getNamespacedLogger({ namespace: main.name });
    const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
    log({ containTypeLinkId });
    const trueTypeLinkId = await deep.id(
      '@freephoenix888/boolean',
      'True'
    );
    log({ trueTypeLinkId });
    const falseTypeLinkId = await deep.id(
      '@freephoenix888/boolean',
      'False'
    );
    log({ falseTypeLinkId });
    const resultTypeLinkId = await deep.id(deep.linkId!, "Result");
    log({ resultTypeLinkId });

    const {
      data: [linkWithObjectValue],
    } = await deep.select({
      id: convertLink.to_id,
    });
    log({ linkWithObjectValue });
    if (!linkWithObjectValue.value?.value) {
      throw new Error(`Link ##${linkWithObjectValue.id} does not have value`);
    }
    if (Object.keys(linkWithObjectValue.value.value).length === 0) {
      throw new Error(`Object value of ##${linkWithObjectValue.id} is empty`);
    }
    const obj = linkWithObjectValue.value.value;
    log({ obj });

    const config = await getConfig({
      linkWithObjectValue,
    });
    log({ config });

    const linksToReserveCount = getLinksToReserveCount({ value: obj });
    log({ linksToReserveCount });
    const reservedLinkIds = await deep.reserve(
      linksToReserveCount *
        (1 + // Type
          1 + // Contain for type
          1 + // Value
          1 + // Contain for value
          1 + // TreeIncludeFromCurrent
          1) + // Contain for TreeIncludeFromCurrent
        (1 + // Tree
          1) // Contain for Tree
    );
    log({ reservedLinkIds });
    const serialOperations = await getInsertSerialOperationsForAnyValue({
      containerLinkId,
      containLinkId: reservedLinkIds.pop()!,
      linkId: reservedLinkIds.pop()!,
      name,
      parentLinkId: undefined,
      value: obj,
    });
    log({ serialOperations });

    const serialResult = await deep.serial({
      operations: serialOperations,
    });
    log({ serialResult });

    return serialResult;
  }

  // function getLinksToReserveCount(options: { obj: Record<string, any> }) {
  //   const { obj } = options;
  //   let count = Object.keys(obj).length;
  //   for (const value of Object.values(obj)) {
  //     if (!value) continue;
  //     if (typeof value === 'object') {
  //       count += getLinksToReserveCount({ obj: value });
  //     } else if (Array.isArray(value) && value.length > 0) {
  //       if(typeof value[0] === 'object') {
  //         count += (getLinksToReserveCount({ obj: value[0] }) * value.length);
  //       };
  //       count += value.length;
  //     }
  //   }
  //   return count;
  // }

  function getLinksToReserveCount(options: { value: string|number|boolean|object }): number {
    const { value } = options;
    const log = getNamespacedLogger({ namespace: getLinksToReserveCount.name });
    log({options})
    let count = 0;
    const typeOfValue = typeof value;
    log({ typeOfValue })
    if(typeOfValue === 'string') {
      count = 2;
    } else if (typeOfValue === 'number') {
      count = 2;
    } else if (typeOfValue === 'boolean') {
      count = 2;
    } else if (Array.isArray(value)) {
      const array = value as Array<any>;
      for (const arrayValue of array) {
        if(!arrayValue) return count;
        count += getLinksToReserveCount({ value: arrayValue });
      }
    } else if (typeOfValue === 'object') {
      for (const [objectKey, objectValue] of Object.entries(value)) {
        if(!value) return count;
        count += getLinksToReserveCount({ value: objectValue });
      }
    } 
    log({ count })
    return count;
  }

  interface Config {
    addParentPropertyNameToChildName: boolean;
  }

  async function getConfig(options: {
    linkWithObjectValue: Link<number>;
  }): Promise<Config> {
    const { linkWithObjectValue } = options;
    const customConfig = (await getConfigLink({ linkWithObjectValue })).value
      ?.value;
    return {
      addParentPropertyNameToChildName:
        customConfig?.addParentPropertyNameToChildName ?? false,
    };
  }

  async function getConfigLink(options: { linkWithObjectValue: Link<number> }) {
    const { linkWithObjectValue } = options;
    const selectData = {
      id: convertLink.from_id,
    };
    const {
      data: [link],
    } = await deep.select(selectData);
    if (!link) {
      throw new Error(
        `Unable to find link that contains ##${
          linkWithObjectValue.type_id
        } by using query ${JSON.stringify(selectData)}`
      );
    }
    return link;
  }

  function getNamespacedLogger({
    namespace,
    depth = DEFAULT_LOG_DEPTH,
  }: {
    namespace: string;
    depth?: number;
  }) {
    return function (content: any) {
      const message = util.inspect(content, { depth });
      logs.push(`${namespace}: ${message}`);
    };
  }

  // async function updateMinilinks() {
  //   const {data: links} = await deep.select({
  //     up: {
  //       tree_id: {
  //         _id: ["@deep-foundation/core", "containTree"]
  //       },
  //       parent_id: {
  //         _id: []
  //       }
  //     }
  //   });
  //   deep.minilinks.apply(links);
  // }
};
