import {
  DeepClient,
  SerialOperation,
  Table,
} from '@deep-foundation/deeplinks/imports/client';
import { BoolExpLink } from '@deep-foundation/deeplinks/imports/client_types';
import { Link, MinilinkCollection } from '@deep-foundation/deeplinks/imports/minilinks';

async ({
  deep,
  data: { newLink: parseItLink, triggeredByLinkId },
}: {
  deep: DeepClient;
  data: { newLink: Link<number>, triggeredByLinkId: number };
}) => {
  const util = await import('util');
  const { createSerialOperation } = await import('@deep-foundation/deeplinks/imports/gql/index')
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

  // async function getRootObjectTypeLinkId(options: { linkId: number }) {
  //   const log = getNamespacedLogger({ namespace: getRootObjectTypeLinkId.name })
  //   log({ options })
  //   const selectData: BoolExpLink = {
  //     type_id: await deep.id(deep.linkId!, "Type"),
  //     from_id: options.linkId
  //   };
  //   log({ selectData })
  //   const { data: [rootObjectType] } = await deep.select(selectData)
  //   log({ rootObjectType })
  //   return rootObjectType.to_id ?? await deep.id(deep.linkId!, "Result");
  // }






  async function main() {
    const log = getNamespacedLogger({ namespace: main.name });
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
    value: string | number;
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
  } & {
    reservedLinkIds: Array<number>;
  }

  type GetInsertSerialOperationsForAnyValueOptions = {
    value: string | number | object | boolean;
    parentLinkId: number | undefined;
    containLinkId: number;
    containerLinkId: number;
    name: string | undefined;
    linkId: number;
    typeId: number;
  } & {
    trueTypeLinkId: number;
    falseTypeLinkId: number;
  } & {
    reservedLinkIds: Array<number>;
  }

  interface Options {
    typesContainerLink: Link<number>,
  }

  interface GetOptionsOptions {
    rootObjectLinkId: number;
  }

  interface GetGetInsertSerialOperationsForAnyValueOptions {
    rootObjectLinkId: number;
  }

  interface UpdateMinilinksOptions {
    packageIdContainingTypes: number,
  }

  interface GetResultLinkOptions {
    rootObjectLinkId: number;
  }

  interface GetUpdateSerialOperationsForObjectValueOptions {
    value: Record<string, any>;
    linkId: number;
  }

  /**
   * Converts object to links
   * 
   * @example
```ts
const converter = await ObjectToLinksConverter.init({
  parseItLink,
  packageContainingTypes
})
```
   */
  class ObjectToLinksConverter {
    reservedLinkIds: Array<number>;
    rootObjectLink: Link<number>;
    packageContainingTypes: Link<number>;
    requiredPackageNames = {
      core: "@deep-foundation/core",
      boolean: "@freephoenix888/boolean",
    }

    constructor(options: ObjectToLinksConverterOptions) {
      this.rootObjectLink = options.rootObjectLink;
      this.reservedLinkIds = options.reservedLinkIds;
      this.packageContainingTypes = options.packageContainingTypes;
    }

    static async init(options: ObjectToLinksConverterInitOptions) {
      const log = getNamespacedLogger({ namespace: `${ObjectToLinksConverter.name}:${this.init.name}` });
      const { parseItLink } = options;
      const {
        data: [rootObjectLink],
      } = await deep.select({ id: parseItLink.to_id });
      log({ rootObjectLink });
      ensureLinkHasValue(rootObjectLink)
      if (Object.keys(rootObjectLink.value.value).length === 0) {
        return
      }
      const linkIdsToReserveCount = this.getLinksToReserveCount({value: rootObjectLink.value.value});
      const reservedLinkIds = await deep.reserve(linkIdsToReserveCount);
      const converter = new this({
        reservedLinkIds,
        rootObjectLink,
        packageContainingTypes
      })
      await converter.addPackageContainingTypesToMinilinks({packageContainingTypes})
      return converter
    }

    private getPackageContainingTypes() {
      const log = getNamespacedLogger({ namespace: `${ObjectToLinksConverter.name}:${this.getPackageContainingTypes.name}` })
      const selectData: BoolExpLink = {
        type_id: deep.idLocal(deep.linkId!, "PackageContainingTypes"),
      }
      log({ selectData })
      const result = deep.minilinks.query(selectData)
      log({result})
      return result
    }

    async getOptions(options: GetOptionsOptions): Promise<Options> {
      const { rootObjectLinkId } = options;
      return {
        typesContainerLink: await this.getTypesContainer(),
      }
    }

    async getTypesContainer(): Promise<Options['typesContainerLink']> {
      const log = getNamespacedLogger({ namespace: this.getTypesContainer.name })
      const { data: [packageContainingTypes] } = await deep.select({
        from_id: this.rootObjectLink.id,
        type_id: await deep.id(deep.linkId!, "PackageContainingTypes"),
      })
      log({ packageContainingTypes })
      return packageContainingTypes;
    }

    static getLinksToReserveCount(options: { value: string | number | boolean | object }): number {
      const { value } = options;
      const log = getNamespacedLogger({ namespace: this.getLinksToReserveCount.name });
      log({ options })
      let count = 0;
      const typeOfValue = typeof value;
      log({ typeOfValue })
      const reservedLinksCountForOneLink = (
        1 + // Type
        1 + // Contain for type
        1 + // TreeIncludeFromCurrent
        1 // Contain for TreeIncludeFromCurrent
      );
      if (typeOfValue === 'string') {
        count = reservedLinksCountForOneLink;
      } else if (typeOfValue === 'number') {
        count = reservedLinksCountForOneLink;
      } else if (typeOfValue === 'boolean') {
        count = reservedLinksCountForOneLink;
      } else if (Array.isArray(value)) {
        const array = value as Array<any>;
        for (const arrayValue of array) {
          if (!arrayValue) return count;
          count += this.getLinksToReserveCount({ value: arrayValue });
        }
      } else if (typeOfValue === 'object') {
        count += reservedLinksCountForOneLink;
        for (const [objectKey, objectValue] of Object.entries(value)) {
          if (!value) return count;
          count += this.getLinksToReserveCount({ value: objectValue });
        }
      }
      log({ count })
      return count;
    }

    async addPackageContainingTypesToMinilinks(options: AddPackageContainingTypesToMinilinksOptions) {
      const log = getNamespacedLogger({ namespace: `${ObjectToLinksConverter.name}:${this.addPackageContainingTypesToMinilinks.name}` });
      const { packageContainingTypes } = options;
      const selectData: BoolExpLink = {
        up: {
          tree_id: deep.idLocal("@deep-foundation/core", "containTree"),
          parent_id: packageContainingTypes.id
        }
      }
      const {data: linksDownToPackageContainingTypes} = await deep.select(selectData)
      log({linksDownToPackageContainingTypes})
      const minilinksApplyResult = deep.minilinks.apply(linksDownToPackageContainingTypes);
      log({minilinksApplyResult})
    }

    async makeUpdateOperationsForStringValue(options: MakeUpdateOperationsForStringValueOptions) {
      throw new Error('Not implemented');
    }

    async makeUpdateOperationsForNumberValue(options: MakeUpdateOperationsForNumberValueOptions) {
      throw new Error('Not implemented');
    }

    async makeUpdateOperationsForBooleanValue(options: MakeUpdateOperationsForBooleanValueOptions) {
      throw new Error('Not implemented');
    }

    async makeUpdateOperationsForAnyValue(options: MakeUpdateOperationsForAnyValueOptions) {
      const log = getNamespacedLogger({ namespace: this.makeUpdateOperationsForAnyValue.name });
      log({options})
      const { linkId, value } = options;
      if(typeof value === 'string') {
        return await this.makeUpdateOperationsForStringValue(options);
      } else if (typeof value === 'number') {
        return await this.makeUpdateOperationsForNumberValue(options)
      } else if (typeof value === 'boolean') {
        return await this.makeUpdateOperationsForBooleanValue(options)
      } else if (typeof value === 'object') {
        return await this.makeUpdateOperationsForObjectValue(options)
      }
    }
    
    async makeUpdateOperationsForObjectValue(options: MakeUpdateOperationsForObjectValueOptions) {
      throw new Error('Not implemented');
      const {value: obj, linkId} = options;
      const {data: linksDownToLinkIdWithObj} = await deep.select({
        up: {
          tree_id: deep.idLocal("@deep-foundation/core", "containTree"),
          parent_id: linkId
        }
      })
      deep.minilinks.apply(linksDownToLinkIdWithObj);
      
      for (const [key, value] of Object.entries(obj)) {
        deep.minilinks.links.forEach(link => {
          // TODO:
          const value = link.value?.value;
          if(!value) return;
          if(typeof value !== 'object') return;
          if(!Object.keys(value).includes(key)) return;
          const typeLinkId = deep.idLocal(key);
          const typeName = deep.nameLocal(typeLinkId);
          if(typeName !== key) return 
          const propertyLinkId = deep.minilinks.query({
            type_id: typeLinkId,
            from_id: linkId
          })
          if(propertyLinkId) {
            
          }
        })
      }
    }
    async getInsertSerialOperationsForStringValue(options: GetInsertSerialOperationsForStringOptions) {
      return this.getInsertSerialOperationsForStringOrNumberValue(options);
    }
    async getInsertSerialOperationsForNumberValue(options: GetInsertSerialOperationsForNumberOptions) {
      return this.getInsertSerialOperationsForStringOrNumberValue(options);
    }
    async getInsertSerialOperationsForBooleanValue(options: GetInsertSerialOperationsForBooleanOptions) {
      const serialOperations: Array<SerialOperation> = [];
      const { typeId, name, value, linkId, parentLinkId, containLinkId, containerLinkId, falseTypeLinkId, trueTypeLinkId } = options;
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
      if (name) {
        const stringValueForContainInsertSerialOperation = createSerialOperation({
          type: 'insert',
          table: 'strings',
          objects: {
            link_id: containLinkId,
            value: name
          }
        })
        log({ stringValueForContainInsertSerialOperation })
        serialOperations.push(stringValueForContainInsertSerialOperation)
      }
      log({ serialOperations });
      return serialOperations;
    }
    async getInsertSerialOperationsForStringOrNumberValue(options: GetInsertSerialOperationsForStringOrNumberOptions) {
      const serialOperations: Array<SerialOperation> = [];
      const { typeId, name, value, linkId, parentLinkId, containLinkId, containerLinkId } = options;
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
      if (name) {
        const stringValueForContainInsertSerialOperation = createSerialOperation({
          type: 'insert',
          table: 'strings',
          objects: {
            link_id: containLinkId,
            value: name
          }
        })
        log({ stringValueForContainInsertSerialOperation })
        serialOperations.push(stringValueForContainInsertSerialOperation)
      }
      log({ serialOperations });
      return serialOperations;
    }
    async getInsertSerialOperationsForObject(options: GetInsertSerialOperationsForObject) {
      const serialOperations: Array<SerialOperation> = [];
      const { typeId, name, value, linkId, parentLinkId, containLinkId, containerLinkId } = options;
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
      if (name) {
        const stringValueForContainInsertSerialOperation = createSerialOperation({
          type: 'insert',
          table: 'strings',
          objects: {
            link_id: containLinkId,
            value: name
          }
        })
        log({ stringValueForContainInsertSerialOperation })
        serialOperations.push(stringValueForContainInsertSerialOperation)
      }
      const { reservedLinkIds } = options;
      for (const [objectKey, objectValue] of Object.entries(value)) {
        const typeId = deep.idLocal(this.packageContainingTypes.id, objectKey);
        if(!typeId) {
          throw new Error(`Could not find type id for ${objectKey}. Path for idLocal: ${[this.packageContainingTypes.id,objectKey]}`);
        }
        await this.getInsertSerialOperationsForAnyValue({
          containerLinkId: linkId,
          containLinkId: reservedLinkIds.pop()!,
          linkId: reservedLinkIds.pop()!,
          name: `${name}${objectKey}`,
          parentLinkId: linkId,
          value: objectValue,
          falseTypeLinkId: options.falseTypeLinkId,
          trueTypeLinkId: options.trueTypeLinkId,
          reservedLinkIds,
          typeId 
        });
      }

      serialOperations.push(containInsertSerialOperation);
      log({ serialOperations });
      return serialOperations;
    }
    async getInsertSerialOperationsForAnyValue(options: GetInsertSerialOperationsForAnyValueOptions) {
      const value = options.value;

      const getHandler = ({ handlerOption, defaultHandler }: { handlerOption: Function | undefined, defaultHandler: Function }) => {
        return handlerOption ?? defaultHandler;
      };

      if (typeof value === 'string') {
        return await this.getInsertSerialOperationsForStringValue({
          ...options,
          value
        });
      } else if (typeof value === 'number') {
        return await this.getInsertSerialOperationsForNumberValue({
          ...options,
          value
        });
      } else if (typeof value === 'boolean') {
        return await this.getInsertSerialOperationsForBooleanValue({
          ...options,
          value
        });
      } else if (typeof value === 'object') {
        return await this.getInsertSerialOperationsForObject({
          ...options,
          value
        });
      } else {
        throw new Error(`Unknown type of value ${value}: ${typeof value}. Only string, number, boolean, and object are supported`);
      }
    }
  }

  function ensureLinkHasValue(link: Link<number>) {
    if (!link.value?.value) {
      throw new Error(`Link ##${link.id} does not have value`);
    }
  }

  interface ObjectToLinksConverterOptions {
    rootObjectLink: Link<number>;
    reservedLinkIds: Array<number>;
    packageContainingTypes: Link<number>;
  }

  interface ObjectToLinksConverterInitOptions {
    parseItLink: Link<number>
  }

  interface MakeUpdateOperationsForValueOptions<TValue extends string | number | object | boolean> {
    linkId: number;
    value: TValue;
  }

  type MakeUpdateOperationsForAnyValueOptions = MakeUpdateOperationsForValueOptions<any>
  type MakeUpdateOperationsForStringValueOptions = MakeUpdateOperationsForValueOptions<string>
  type MakeUpdateOperationsForNumberValueOptions = MakeUpdateOperationsForValueOptions<number>
  type MakeUpdateOperationsForBooleanValueOptions = MakeUpdateOperationsForValueOptions<boolean>
  type MakeUpdateOperationsForObjectValueOptions = MakeUpdateOperationsForValueOptions<object>

  interface AddPackageContainingTypesToMinilinksOptions {
    packageContainingTypes: Link<number>
  }

};

