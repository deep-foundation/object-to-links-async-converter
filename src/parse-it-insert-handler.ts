import {
  DeepClient,
  SerialOperation,
  Table,
} from '@deep-foundation/deeplinks/imports/client';
import { BoolExpLink } from '@deep-foundation/deeplinks/imports/client_types';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';

async ({
  deep,
  data: { newLink: parseItLink ,triggeredByLinkId},
}: {
  deep: DeepClient;
  data: { newLink: Link<number>, triggeredByLinkId: number};
}) => {
  const util = await import('util');
  const {createSerialOperation} = await import('@deep-foundation/deeplinks/imports/gql/index')
  const logs: Array<any> = [];
  const DEFAULT_LOG_DEPTH = 3;
  const defaults = getDefaults();
  const options = await getOptions({rootObjectLinkId: parseItLink.to_id!});
  const packageContainingTypes = options.packageContainingTypes;
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

  async function getOptions(options: GetOptionsOptions): Promise<Options> {
    const {rootObjectLinkId} = options;
    return {
      packageContainingTypes: await getPackageContainingTypes(),
      rootObjectTypeLinkId: await getRootObjectTypeLinkId({linkId: rootObjectLinkId}),
      getInsertSerialOperationsForAnyValue: await getGetInsertSerialOperationsForAnyValue({rootObjectLinkId: rootObjectLinkId}),
    }
  }

  async function getGetInsertSerialOperationsForAnyValue(options: GetGetInsertSerialOperationsForAnyValueOptions): Promise<Options['getInsertSerialOperationsForAnyValue']> {
    const log = getNamespacedLogger({namespace: getGetInsertSerialOperationsForAnyValue.name})
    const selectData: BoolExpLink = {
      type_id: await deep.id(deep.linkId!, "GetInsertSerialOperationsForAnyValue"),
      from_id: options.rootObjectLinkId
    }
    log({selectData})
    const {data: [link]} = await deep.select(selectData)
    log({link})
    if(!link) {
      return defaults.getInsertSerialOperationsForAnyValue
    } 
    const getInsertSerialOperationsForAnyValue = !link.value?.value
    log({getInsertSerialOperationsForAnyValue})
    if(!getInsertSerialOperationsForAnyValue) {
      throw new Error(`${link.id} does not have a value`)
    }
    // TODO Implement when deep.execute will be ready?
    // @ts-ignore
    return getInsertSerialOperationsForAnyValue
  }

  async function getPackageContainingTypes(): Promise<Options['packageContainingTypes']> {
    const log = getNamespacedLogger({namespace: getPackageContainingTypes.name})
    const {data: [packageContainingTypes]} = await deep.select({
      from_id: parseItLink.to_id,
      type_id: await deep.id(deep.linkId!, "PackageContainingTypes"),
    })
    log({packageContainingTypes})
    return packageContainingTypes;
  }

  async function getRootObjectTypeLinkId(options: {linkId: number}) {
    const log = getNamespacedLogger({namespace: getRootObjectTypeLinkId.name})
    log({options})
    const selectData: BoolExpLink = {
      type_id: await deep.id(deep.linkId!, "Type"),
      from_id: options.linkId
    };
    log({selectData})
    const {data: [rootObjectType]} = await deep.select(selectData)
    log({rootObjectType})
    return rootObjectType.to_id ?? await deep.id(deep.linkId!, "Object");
  }

  function getDefaults () {
    return {
      getInsertSerialOperationsForStringValue: async function getInsertSerialOperationsForStringValue(options: GetInsertSerialOperationsForStringOptions) {
        return this.getInsertSerialOperationsForStringOrNumberValue(options);
      },
      getInsertSerialOperationsForNumberValue: async function getInsertSerialOperationsForNumberValue(options: GetInsertSerialOperationsForNumberOptions) {
        return this.getInsertSerialOperationsForStringOrNumberValue(options);
      },
      getInsertSerialOperationsForBooleanValue: async function getInsertSerialOperationsForBooleanValue(options: GetInsertSerialOperationsForBooleanOptions) {
        const serialOperations: Array<SerialOperation> = [];
        const { typeId, name, value, linkId,  parentLinkId, containLinkId,containerLinkId,falseTypeLinkId,trueTypeLinkId } = options;
        const log = getNamespacedLogger({
          namespace: this.getInsertSerialOperationsForStringValue.name,
        });
        const linkInsertSerialOperation = createSerialOperation({
          type: 'insert',
          table: 'links',
          objects: {
            id: linkId,
            ...(parentLinkId && { from_id: parentLinkId }),
            to_id: value ? trueTypeLinkId : falseTypeLinkId,
            type_id: typeId
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
        if(name) {
          const stringValueForContainInsertSerialOperation = createSerialOperation({
            type: 'insert',
            table: 'strings',
            objects: {
              link_id: containLinkId,
              value: name
            }
          })
          log({stringValueForContainInsertSerialOperation})
          serialOperations.push(stringValueForContainInsertSerialOperation)
        }
        log({ serialOperations });
        return serialOperations;
      },
      getInsertSerialOperationsForStringOrNumberValue: async function getInsertSerialOperationsForStringOrNumberValue(options: GetInsertSerialOperationsForStringOrNumberOptions) {
        const serialOperations: Array<SerialOperation> = [];
        const { typeId, name, value, linkId,  parentLinkId, containLinkId,containerLinkId } = options;
        const log = getNamespacedLogger({
          namespace: this.getInsertSerialOperationsForStringValue.name,
        });
        const linkInsertSerialOperation = createSerialOperation({
          type: 'insert',
          table: 'links',
          objects: {
            id: linkId,
            ...(parentLinkId && { from_id: parentLinkId, to_id: parentLinkId }),
            type_id: typeId
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
        if(name) {
          const stringValueForContainInsertSerialOperation = createSerialOperation({
            type: 'insert',
            table: 'strings',
            objects: {
              link_id: containLinkId,
              value: name
            }
          })
          log({stringValueForContainInsertSerialOperation})
          serialOperations.push(stringValueForContainInsertSerialOperation)
        }
        log({ serialOperations });
        return serialOperations;
      },
      getInsertSerialOperationsForObject: async function getInsertSerialOperationsForObject(options: GetInsertSerialOperationsForObject) {
        const serialOperations: Array<SerialOperation> = [];
        const { typeId, name, value, linkId,  parentLinkId, containLinkId,containerLinkId } = options;
        const log = getNamespacedLogger({
          namespace: this.getInsertSerialOperationsForStringValue.name,
        });
        const linkInsertSerialOperation = createSerialOperation({
          type: 'insert',
          table: 'links',
          objects: {
            id: linkId,
            ...(parentLinkId && { from_id: parentLinkId, to_id: parentLinkId }),
            type_id: typeId
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
        if(name) {
          const stringValueForContainInsertSerialOperation = createSerialOperation({
            type: 'insert',
            table: 'strings',
            objects: {
              link_id: containLinkId,
              value: name
            }
          })
          log({stringValueForContainInsertSerialOperation})
          serialOperations.push(stringValueForContainInsertSerialOperation)
        }   
        const {reservedLinkIds} = options;
        for (const [objectKey, objectValue] of Object.entries(value)) {
          await (options.getInsertSerialOperationsForAnyValue ?? this.getInsertSerialOperationsForAnyValue)({
            containerLinkId: linkId,
            containLinkId: reservedLinkIds.pop()!,
            linkId: reservedLinkIds.pop()!,
            name: `${name}${objectKey}`,
            parentLinkId: linkId,
            value: objectValue,
            falseTypeLinkId: options.falseTypeLinkId,
            trueTypeLinkId: options.trueTypeLinkId,
            reservedLinkIds,
            typeId: await deep.id(packageContainingTypes.id, objectKey)
          });
        }
    
        serialOperations.push(containInsertSerialOperation);
        log({ serialOperations });
        return serialOperations;
      },
      getInsertSerialOperationsForAnyValue: async function getInsertSerialOperationsForAnyValue(options: GetInsertSerialOperationsForAnyValueOptions) {
        const value = options.value;
        const type = typeof value;
      
        const getHandler = ({ handlerOption, defaultHandler }: { handlerOption: Function|undefined, defaultHandler: Function }) => {
          return handlerOption ?? defaultHandler;
        };
      
        if (type === 'string') {
          return await getHandler({ handlerOption: options.getInsertSerialOperationsForStringValue, defaultHandler: this.getInsertSerialOperationsForStringValue })({
            ...options,
            value
          });
        } else if (type === 'number') {
          return await getHandler({ handlerOption: options.getInsertSerialOperationsForNumberValue, defaultHandler: this.getInsertSerialOperationsForNumberValue })({
            ...options,
            value
          });
        } else if (type === 'boolean') {
          return await getHandler({ handlerOption: options.getInsertSerialOperationsForBooleanValue, defaultHandler: this.getInsertSerialOperationsForBooleanValue })({
            ...options,
            value
          });
        } else if (type === 'object') {
          return await getHandler({ handlerOption: options.getInsertSerialOperationsForObject, defaultHandler: this.getInsertSerialOperationsForObject })({
            ...options,
            value
          });
        } else {
          throw new Error(`Unknown type of value ${value}: ${type}. Only string, number, boolean, and object are supported`);
        }
      }
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
      id: parseItLink.to_id,
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

      const resultLinkId = reservedLinkIds.pop()!;
      const rootObjectLinkId = reservedLinkIds.pop()!;

    let serialOperations = await (options.getInsertSerialOperationsForAnyValue ?? defaults.getInsertSerialOperationsForAnyValue)({
      containerLinkId: resultLinkId,
      containLinkId: reservedLinkIds.pop()!,
      linkId: rootObjectLinkId,
      name: undefined,
      typeId: options.rootObjectTypeLinkId, 
      parentLinkId: undefined,
      value: obj,
      trueTypeLinkId,
      falseTypeLinkId,
      reservedLinkIds
    });
    serialOperations = [
      ...serialOperations,
      createSerialOperation({
        type: 'insert',
        table: 'links',
        objects: {
          id: resultLinkId,
          type_id: resultTypeLinkId,
          from_id: linkWithObjectValue.id,
          to_id: rootObjectLinkId,
        }
      }),
      createSerialOperation({
        type: 'insert',
        table: 'links',
        objects: {
          type_id: containTypeLinkId,
          from_id: linkWithObjectValue.id,
          to_id: resultLinkId,
        }
      })
    ]
    log({ serialOperations });

    const serialResult = await deep.serial({
      operations: serialOperations,
    });
    log({ serialResult });

    return {
      resultLinkId,
      serialResult
    };
  }

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

  type GetInsertSerialOperationsForStringOrNumberOptions = GetInsertSerialOperationsForAnyValueOptions & {
    value: string|number;
  } 

  type GetInsertSerialOperationsForStringOptions = GetInsertSerialOperationsForAnyValueOptions & {
    value: string;
  }

  type GetInsertSerialOperationsForNumberOptions = GetInsertSerialOperationsForAnyValueOptions & {
    value: number;
  }

  type GetInsertSerialOperationsForBooleanOptions = GetInsertSerialOperationsForAnyValueOptions & {
    value: boolean;
  } & {
    trueTypeLinkId: number;
    falseTypeLinkId: number;
  }  

  type GetInsertSerialOperationsForObject = GetInsertSerialOperationsForAnyValueOptions & {
    value: object;
    getInsertSerialOperationsForAnyValue?: typeof defaults.getInsertSerialOperationsForAnyValue;
  } & {
    reservedLinkIds: Array<number>;
  }  

  type GetInsertSerialOperationsForAnyValueOptions = {
    value: string|number|object|boolean;
    parentLinkId: number|undefined;
    containLinkId: number;
    containerLinkId: number;
    name: string | undefined;
    linkId: number;
    typeId: number;
    getInsertSerialOperationsForObject?: typeof defaults.getInsertSerialOperationsForObject;
    getInsertSerialOperationsForStringValue?: typeof defaults.getInsertSerialOperationsForStringValue;
    getInsertSerialOperationsForNumberValue?: typeof defaults.getInsertSerialOperationsForNumberValue;
    getInsertSerialOperationsForBooleanValue?: typeof defaults.getInsertSerialOperationsForBooleanValue;
  } & {
    trueTypeLinkId: number;
    falseTypeLinkId: number;
  } & {
    reservedLinkIds: Array<number>;
  }

  interface Options {
    packageContainingTypes: Link<number>,
    rootObjectTypeLinkId: number;
    getInsertSerialOperationsForAnyValue: typeof defaults.getInsertSerialOperationsForAnyValue;
  }

  interface GetOptionsOptions {
    rootObjectLinkId: number;
  }

  interface GetGetInsertSerialOperationsForAnyValueOptions {
    rootObjectLinkId: number;
  }
};

