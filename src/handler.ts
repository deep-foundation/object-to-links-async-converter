import {
  DeepClient,
  SerialOperation,
  Table,
} from '@deep-foundation/deeplinks/imports/client';
import { BoolExpLink } from '@deep-foundation/deeplinks/imports/client_types';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';

async ({
  deep,
  data: { newLink: convertLink },
}: {
  deep: DeepClient;
  data: { newLink: Link<number> };
}) => {
  const util = await import('util');
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

  type GetInsertSerialOperationsForPrimitiveOptions = GetInsertSerialOperationsForAnyValueOptions

  async function getInsertSerialOperationsForPrimitiveValue(options: GetInsertSerialOperationsForPrimitiveOptions) {
    const serialOperations: Array<SerialOperation> = [];
    const { name, value, linkId,  parentLinkId, containLinkId,containerLinkId } = options;
    const log = await getNamespacedLogger({
      namespace: getInsertSerialOperationsForStringValue.name,
    });
    const typeOfValue = typeof value;
    if(typeOfValue !== 'string' && typeOfValue !== 'number') {
      throw new Error(`Value ${value} is not a primitive value`);
    }
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
      table: `${typeOfValue}s`,
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
    const serialOperations: Array<SerialOperation> = [];
    const { name, value, linkId,  parentLinkId, containLinkId,containerLinkId } = options;
    const log = await getNamespacedLogger({
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
      table: 'strings',
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

  type GetInsertSerialOperationsForObject = GetInsertSerialOperationsForAnyValueOptions & {
    value: object;
  }

  async function getInsertSerialOperationsForObject(options: GetInsertSerialOperationsForObject) {
    const serialOperations: Array<SerialOperation> = [];
    const { name, value, linkId,  parentLinkId, containLinkId,containerLinkId } = options;
    const log = await getNamespacedLogger({
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

  interface GetInsertSerialOperationsForAnyValueOptions {
    value: string|number|object|boolean;
    parentLinkId: number;
    containLinkId: number;
    containerLinkId: number;
    name: string;
    linkId: number;
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
        value
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
    const log = await getNamespacedLogger({ namespace: main.name });
    const containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain');
    log({ containTypeLinkId });
    const typeTypeLinkId = await deep.id('@deep-foundation/core', 'Type');
    log({ typeTypeLinkId });
    const valueTypeLinkId = await deep.id('@deep-foundation/core', 'Value');
    log({ valueTypeLinkId });
    const booleanTypeLinkId = await deep.id(
      '@freephoenix888/boolean',
      'Boolean'
    );
    log({ booleanTypeLinkId });
    const treeIncludeFromCurrentTypeLinkId = await deep.id(
      '@deep-foundation/core',
      'TreeIncludeFromCurrent'
    );
    log({ treeIncludeFromCurrentTypeLinkId });

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

    const linksToReserveCount = getLinksToReserveCount({ obj });
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
      containLinkId,
      linkId,
      name,
      parentLinkId,
      value,
    });
    log({ serialOperations });

    const serialResult = await deep.serial({
      operations: serialOperations,
    });
    log({ serialResult });

    return serialResult;
  }

  function getLinksToReserveCount(options: { obj: Record<string, any> }) {
    const { obj } = options;
    let count = Object.keys(obj).length;
    for (const value of Object.values(obj)) {
      if (!value) continue;
      if (typeof value === 'object') {
        count += getLinksToReserveCount({ obj: value });
      } else if (Array.isArray(value) && value.length > 0) {
        count += getLinksToReserveCount({ obj: value[0] });
      }
    }
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

  async function getNamespacedLogger({
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
};
