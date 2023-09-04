import {
  DeepClient,
  DeepClientInstance,
  DeepClientResult,
  SerialOperation,
  Table,
} from "@deep-foundation/deeplinks/imports/client.js";
import { BoolExpLink } from "@deep-foundation/deeplinks/imports/client_types.js";
import {
  Link,
  MinilinksResult,
} from "@deep-foundation/deeplinks/imports/minilinks.js";
import { pascalCase } from "case-anything";

async ({
  deep,
  rootLinkId,
  obj,
}: {
  deep: DeepClient;
  rootLinkId: number;
  obj: Record<string, string | number | object>;
}) => {
  const util = await import("util");
  const { createSerialOperation } = await import(
    "@deep-foundation/deeplinks/imports/gql/index.js"
  );
  const logs: Array<any> = [];
  const DEFAULT_LOG_DEPTH = 3;

  /**
   * Converts object to links
   * 
   * @example
```ts
const objectToLinksConverter = await ObjectToLinksConverter.init({
  parseItLink
})
const result = objectToLinksConverter?.convert({
  parseItLink
})
```
   */
  class ObjectToLinksConverter {
    reservedLinkIds: Array<number>;
    rootLink: Link<number>;
    typesContainer: Link<number>;
    requiredPackageNames = {
      core: "@deep-foundation/core",
      boolean: "@freephoenix888/boolean",
    };

    constructor(options: ObjectToLinksConverterOptions) {
      this.rootLink = options.rootLink;
      this.reservedLinkIds = options.reservedLinkIds;
      this.typesContainer = options.typesContainer;
    }

    static getNamespacedLogger({
      namespace,
      depth = DEFAULT_LOG_DEPTH,
    }: {
      namespace: string;
      depth?: number;
    }) {
      return function (content: any) {
        const message = util.inspect(content, { depth });
        logs.push(`${ObjectToLinksConverter.name}:${namespace}: ${message}`);
      };
    }

    static async applyContainTreeLinksDownToParentToMinilinks(
      options: ApplyContainTreeLinksDownToParentToMinilinksOptions,
    ) {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.applyContainTreeLinksDownToParentToMinilinks.name,
      });
      log({ options });
      const links = (await this.getContainTreeLinksDownToParent({
        linkExp: options.linkExp,
        useMinilinks: false,
      })) as DeepClientResult<Link<number>[]>;
      log({ links });
      const minilinksApplyResult = options.minilinks.apply(links.data);
      log({ minilinksApplyResult });
      return minilinksApplyResult;
    }

    static async getContainTreeLinksDownToParent(
      options: GetContainTreeLinksDownToLinkOptions,
    ) {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.getContainTreeLinksDownToParent.name,
      });
      log({ options });
      const { linkExp, useMinilinks } = options;
      const query: BoolExpLink = {
        up: {
          tree_id: useMinilinks
            ? deep.idLocal("@deep-foundation/core", "containTree")
            : await deep.id("@deep-foundation/core", "containTree"),
          parent: linkExp,
        },
      };
      log({ query });
      const result = useMinilinks
        ? deep.minilinks.query(query)
        : await deep.select(query);
      log({ result });
      return result;
    }

    /**
     * Undefined is returned of root object is empty
     */
    static async init(
      options: ObjectToLinksConverterInitOptions,
    ): Promise<ObjectToLinksConverter | undefined> {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: `${this.init.name}`,
      });
      log({ options });
      const { obj } = options;
      const rootLink: Link<number> = options.rootLinkId
        ? await deep.select(options.rootLinkId).then((result) => result.data[0])
        : await deep
            .insert(
              {
                type_id: deep.idLocal(deep.linkId!, "Root"),
              },
              {
                returning: deep.linksSelectReturning,
              },
            )
            .then((result) => result.data[0] as Link<number>);
      log({ rootLink });
      if (Object.keys(obj).length === 0) {
        return;
      }
      const applyMinilinksResult =
        await this.applyContainTreeLinksDownToParentToMinilinks({
          linkExp: {
            id: rootLink.id,
          },
          minilinks: deep.minilinks,
        });
      log({ applyMinilinksResult });
      const typesContainer = this.getTypesContainer();
      log({ typesContainer });
      // const linkIdsToReserveCount = this.getLinksToReserveCount({value: obj});
      // log({linkIdsToReserveCount})
      // const reservedLinkIds = await deep.reserve(linkIdsToReserveCount);
      // log({reservedLinkIds})
      const converter = new this({
        reservedLinkIds: [],
        rootLink,
        typesContainer,
      });
      log({ converter });
      return converter;
    }

    async convert() {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.convert.name,
      });

      const obj = this.rootLink.value.value;
      log({ obj });

      const operations = await this.makeUpdateOperationsForObjectValue({
        link: this.rootLink,
        value: obj,
        isRootObject: true,
      });
      log({ operations });

      const serialResult = await deep.serial({
        operations,
      });
      log({ serialResult });

      return serialResult;
    }

    static getTypesContainer() {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: `${this.getTypesContainer.name}`,
      });
      const selectData: BoolExpLink = {
        type_id: deep.idLocal(deep.linkId!, "TypesContainer"),
      };
      log({ selectData });
      const queryResult = deep.minilinks.query(selectData);
      log({ queryResult });
      const typesContainer = queryResult[0];
      log({ typesContainer });
      if (!typesContainer) {
        throw new Error(
          `Failed to find package containing types by using select data ${JSON.stringify(
            selectData,
            null,
            2,
          )}`,
        );
      }
      return typesContainer;
    }

    async getOptions(options: GetOptionsOptions): Promise<Options> {
      const { rootLinkId } = options;
      return {
        typesContainerLink: await this.getTypesContainer(),
      };
    }

    async getTypesContainer(): Promise<Options["typesContainerLink"]> {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.getTypesContainer.name,
      });
      const {
        data: [typesContainer],
      } = await deep.select({
        from_id: this.rootLink.id,
        type_id: await deep.id(deep.linkId!, "TypesContainer"),
      });
      log({ typesContainer });
      return typesContainer;
    }

    static getLinksToReserveCount(options: {
      value: string | number | boolean | object;
    }): number {
      const { value } = options;
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.getLinksToReserveCount.name,
      });
      log({ options });
      let count = 0;
      const typeOfValue = typeof value;
      log({ typeOfValue });
      const reservedLinksCountForOneLink =
        1 + // Type
        1; // Contain for type
      if (typeOfValue === "string") {
        count = reservedLinksCountForOneLink;
      } else if (typeOfValue === "number") {
        count = reservedLinksCountForOneLink;
      } else if (typeOfValue === "boolean") {
        count = reservedLinksCountForOneLink;
      } else if (Array.isArray(value)) {
        const array = value as Array<any>;
        for (const arrayValue of array) {
          if (!arrayValue) return count;
          count += this.getLinksToReserveCount({ value: arrayValue });
        }
      } else if (typeOfValue === "object") {
        count += reservedLinksCountForOneLink;
        for (const [propertyKey, propertyValue] of Object.entries(value)) {
          if (!value) return count;
          count += this.getLinksToReserveCount({ value: propertyValue });
        }
      }
      log({ count });
      return count;
    }

    async makeUpdateOperationsForPrimitiveValue<
      TValue extends string | number | boolean,
    >(options: UpdateOperationsForPrimitiveValueOptions<TValue>) {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: `${this.makeUpdateOperationsForPrimitiveValue.name}`,
      });
      log({ options });
      const { link, value } = options;
      const serialOperations: Array<SerialOperation> = [];
      if (typeof value === "boolean") {
        serialOperations.push(
          createSerialOperation({
            type: "update",
            table: "links",
            exp: {
              id: link.id,
            },
            value: {
              to_id: value
                ? await deep.id(this.requiredPackageNames.boolean, "True")
                : await deep.id(this.requiredPackageNames.boolean, "False"),
            },
          }),
        );
      } else {
        serialOperations.push(
          createSerialOperation({
            type: "update",
            table: `${typeof value
              .toString()
              .toLocaleLowerCase()}s` as Table<"update">,
            exp: {
              link_id: link.id,
            },
            value: {
              value: link,
            },
          }),
        );
      }

      return serialOperations;
    }

    async makeUpdateOperationsForObjectValue(
      options: UpdateOperationsForObjectValueOptions,
    ) {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.makeUpdateOperationsForObjectValue.name,
      });
      log({ options });
      const { link, value, isRootObject, parentPropertyNames = [] } = options;
      const serialOperations: Array<SerialOperation> = [];

      if (!isRootObject) {
        const linkUpdateOperation = createSerialOperation({
          type: "update",
          table: "objects",
          exp: {
            link_id: link.id,
          },
          value: {
            value: value,
          },
        });
        log({ linkUpdateOperation });
        serialOperations.push(linkUpdateOperation);
      }

      const propertyLinks: Array<Link<number>> = [];
      for (const [propertyKey, propertyValue] of Object.entries(value)) {
        log({ propertyKey, propertyValue });
        const propertyName = pascalCase(
          parentPropertyNames.join("") + propertyKey,
        );
        log({ propertyName });
        const propertyTypeLinkId = deep.idLocal(
          this.typesContainer.id,
          propertyName,
        );
        log({ propertyTypeLinkId });
        if (!propertyTypeLinkId) {
          throw new Error(
            `Failed to find type id for ${propertyName}. Path for idLocal: ${[
              this.typesContainer.id,
              propertyName,
            ]}`,
          );
        }
        const [propertyLink] = deep.minilinks.query({
          type_id: propertyTypeLinkId,
          from_id: link.id,
        });
        log({ propertyLink });
        propertyLinks.push(propertyLink);
        if (propertyLink) {
          let propertyUpdateOperations: Array<SerialOperation> = [];
          if (typeof value === "object") {
            propertyUpdateOperations =
              await this.makeUpdateOperationsForObjectValue({
                link: propertyLink,
                value: propertyValue,
                parentPropertyNames: [...parentPropertyNames, propertyKey],
              });
          } else {
            propertyUpdateOperations =
              await this.makeUpdateOperationsForPrimitiveValue({
                link: propertyLink,
                value: propertyValue,
              });
          }
          log({ propertyUpdateOperations });
          serialOperations.push(...propertyUpdateOperations);
        } else {
          const idLocalArgs: Parameters<DeepClientInstance["idLocal"]> = [
            this.typesContainer.id,
            pascalCase(typeof value),
          ];
          const typeLinkId = deep.idLocal(...idLocalArgs);
          if (!typeLinkId) {
            throw new Error(
              `Failed to get type id for ${propertyKey}. Path for idLocal: ${idLocalArgs}`,
            );
          }
          const propertyInsertSerialOperations =
            await this.makeInsertSerialOperationsForAnyValue({
              linkId: this.reservedLinkIds.pop()!,
              parentLinkId: link.id,
              typeLinkId: typeLinkId,
              value: propertyValue,
            });
          log({ propertyInsertSerialOperations });
          serialOperations.push(...propertyInsertSerialOperations);
        }

        const parseItInsertSerialOperations = propertyLinks.map(
          (propertyLink) =>
            this.makeParseItInsertOperations({ linkId: propertyLink.id }),
        );
        log({ parseItInsertSerialOperations });
        serialOperations.push(...parseItInsertSerialOperations.flat());

        log({ serialOperations });
        return serialOperations;
      }

      return serialOperations;
    }

    makeParseItInsertOperations(options: MakeParseItInsertOperationsOptions) {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.makeParseItInsertOperations.name,
      });
      log({ options });
      const { linkId: linkId } = options;
      const serialOperations: Array<SerialOperation> = [];
      const parseItInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          type_id: deep.idLocal(deep.linkId!, "ParseIt"),
          from_id: linkId,
          to_id: linkId,
        },
      });
      log({ parseItInsertSerialOperation });
      serialOperations.push(parseItInsertSerialOperation);
      log({ serialOperations });
      return serialOperations;
    }

    async makeInsertSerialOperationsForStringValue(
      options: MakeInsertSerialOperationsForStringOptions,
    ) {
      return this.makeInsertSerialOperationsForStringOrNumberValue(options);
    }
    async makeInsertSerialOperationsForNumberValue(
      options: MakeInsertSerialOperationsForNumberOptions,
    ) {
      return this.makeInsertSerialOperationsForStringOrNumberValue(options);
    }
    async makeInsertSerialOperationsForBooleanValue(
      options: MakeInsertSerialOperationsForBooleanOptions,
    ) {
      const serialOperations: Array<SerialOperation> = [];
      const { value, parentLinkId, linkId, typeLinkId } = options;
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.makeInsertSerialOperationsForStringValue.name,
      });

      const linkInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          id: linkId,
          type_id: typeLinkId,
          from_id: parentLinkId,
          to_id: value
            ? deep.idLocal(this.requiredPackageNames.boolean, "True")
            : deep.idLocal(this.requiredPackageNames.boolean, "False"),
        },
      });
      log({ linkInsertSerialOperation });
      serialOperations.push(linkInsertSerialOperation);

      const containInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          type_id: deep.idLocal("@deep-foundation/core", "Contain"),
          from_id: parentLinkId,
          to_id: linkId,
        },
      });
      log({ containInsertSerialOperation });
      serialOperations.push(containInsertSerialOperation);

      log({ serialOperations });
      return serialOperations;
    }
    async makeInsertSerialOperationsForStringOrNumberValue(
      options: MakeInsertSerialOperationsForStringOrNumberOptions,
    ) {
      const serialOperations: Array<SerialOperation> = [];
      const { value, parentLinkId, linkId, typeLinkId } = options;
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.makeInsertSerialOperationsForStringValue.name,
      });
      const linkInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          id: linkId,
          from_id: parentLinkId,
          to_id: parentLinkId,
          type_id: typeLinkId,
        },
      });
      log({ linkInsertSerialOperation });
      serialOperations.push(linkInsertSerialOperation);

      const stringValueInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: `${typeof value}s` as Table<"insert">,
        objects: {
          link_id: linkId,
          value: value,
        },
      });
      log({ stringValueInsertSerialOperation });
      serialOperations.push(stringValueInsertSerialOperation);

      const containInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          type_id: deep.idLocal("@deep-foundation/core", "Contain"),
          from_id: parentLinkId,
          to_id: linkId,
        },
      });
      log({ containInsertSerialOperation });
      serialOperations.push(containInsertSerialOperation);

      log({ serialOperations });
      return serialOperations;
    }
    async makeInsertSerialOperationsForObject(
      options: MakeInsertSerialOperationsForObject,
    ) {
      const serialOperations: Array<SerialOperation> = [];
      const { typeLinkId, value, linkId, parentLinkId } = options;
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.makeInsertSerialOperationsForStringValue.name,
      });
      const linkInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          id: linkId,
          from_id: parentLinkId,
          to_id: parentLinkId,
          type_id: typeLinkId,
        },
      });
      log({ linkInsertSerialOperation });
      serialOperations.push(linkInsertSerialOperation);

      const objectValueInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "objects",
        objects: {
          link_id: linkId,
          value: value,
        },
      });
      log({ objectValueInsertSerialOperation });
      serialOperations.push(objectValueInsertSerialOperation);

      const containInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          type_id: deep.idLocal("@deep-foundation/core", "Contain"),
          from_id: parentLinkId,
          to_id: linkId,
        },
      });
      log({ containInsertSerialOperation });
      serialOperations.push(containInsertSerialOperation);

      for (const [propertyKey, propertyValue] of Object.entries(value)) {
        const typeOfValue = typeof propertyValue;
        if (!["string", "number", "boolean"].includes(typeOfValue)) {
          continue;
        }
        const idLocalArgs: Parameters<DeepClientInstance["idLocal"]> = [
          this.typesContainer.id,
          pascalCase(typeOfValue),
        ];
        const typeLinkId = deep.idLocal(...idLocalArgs);
        if (!typeLinkId) {
          throw new Error(
            `Failed to get type id for ${propertyKey}. Path for idLocal: ${idLocalArgs}`,
          );
        }
        const propertyInsertOperations =
          await this.makeInsertSerialOperationsForAnyValue({
            linkId: this.reservedLinkIds.pop()!,
            parentLinkId: linkId,
            typeLinkId: typeLinkId,
            value: propertyValue,
          });
        serialOperations.push(...propertyInsertOperations);
      }

      serialOperations.push(containInsertSerialOperation);
      log({ serialOperations });
      return serialOperations;
    }
    async makeInsertSerialOperationsForAnyValue<TValue extends Value>(
      options: MakeInsertSerialOperationsForAnyValueOptions<TValue>,
    ) {
      const { value, parentLinkId, linkId } = options;
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: this.makeInsertSerialOperationsForAnyValue.name,
      });

      const serialOperations: Array<SerialOperation> = [];
      if (typeof value === "string") {
        const innerSerialOperations =
          await this.makeInsertSerialOperationsForStringValue({
            ...options,
            value,
          });
        serialOperations.push(...innerSerialOperations);
      } else if (typeof value === "number") {
        const innerSerialOperations =
          await this.makeInsertSerialOperationsForNumberValue({
            ...options,
            value,
          });
        serialOperations.push(...innerSerialOperations);
      } else if (typeof value === "boolean") {
        const innerSerialOperations =
          await this.makeInsertSerialOperationsForBooleanValue({
            ...options,
            value,
          });
        serialOperations.push(...innerSerialOperations);
      } else if (typeof value === "object") {
        const innerSerialOperations =
          await this.makeInsertSerialOperationsForObject({
            ...options,
            value,
          });
        serialOperations.push(...innerSerialOperations);
      } else {
        throw new Error(
          `Unknown type of value ${value}: ${typeof value}. Only string, number, boolean, and object are supported`,
        );
      }

      const propertyInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          type_id: deep.idLocal(deep.linkId!, "Property"),
          from_id: parentLinkId,
          to_id: linkId,
        },
      });
      log({ propertyInsertSerialOperation });
      serialOperations.push(propertyInsertSerialOperation);

      return serialOperations;
    }
  }

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

  async function main() {
    const log = ObjectToLinksConverter.getNamespacedLogger({
      namespace: main.name,
    });

    const objectToLinksConverter = await ObjectToLinksConverter.init({
      obj,
      rootLinkId,
    });
    log({ objectToLinksConverter });

    const convertResult = objectToLinksConverter?.convert();
    log({ convertResult });

    return convertResult;
  }

  type ApplyContainTreeLinksDownToParentToMinilinksOptions = Omit<
    GetContainTreeLinksDownToLinkOptions,
    "useMinilinks"
  > & {
    minilinks: MinilinksResult<Link<number>>;
  };

  interface GetContainTreeLinksDownToLinkOptions {
    linkExp: BoolExpLink;
    useMinilinks?: boolean;
  }

  interface ObjectToLinksConverterOptions {
    rootLink: Link<number>;
    reservedLinkIds: Array<number>;
    typesContainer: Link<number>;
  }

  interface ObjectToLinksConverterInitOptions {
    obj: Record<string, string | number | object>;
    rootLinkId?: number;
  }
  type MakeInsertSerialOperationsForStringOrNumberOptions =
    MakeInsertSerialOperationsForAnyValueOptions<string | number> & {
      value: string | number;
    };

  type MakeInsertSerialOperationsForStringOptions =
    MakeInsertSerialOperationsForAnyValueOptions<string> & {
      value: string;
    };

  type MakeInsertSerialOperationsForNumberOptions =
    MakeInsertSerialOperationsForAnyValueOptions<number> & {
      value: number;
    };

  type MakeInsertSerialOperationsForBooleanOptions =
    MakeInsertSerialOperationsForAnyValueOptions<boolean> & {
      value: boolean;
    };

  type MakeInsertSerialOperationsForObject =
    MakeInsertSerialOperationsForAnyValueOptions<object> & {
      value: object;
    };

  type MakeInsertSerialOperationsForAnyValueOptions<TValue extends Value> = {
    parentLinkId: number;
    linkId: number;
    value: TValue;
    typeLinkId: number;
  };

  type Value = string | number | boolean | object;

  interface Options {
    typesContainerLink: Link<number>;
  }

  interface GetOptionsOptions {
    rootLinkId: number;
  }

  interface UpdateOperationsForValueOptions<
    TValue extends string | number | boolean | object,
  > {
    link: Link<number>;
    value: TValue;
  }

  type UpdateOperationsForPrimitiveValueOptions<
    TValue extends string | number | boolean,
  > = UpdateOperationsForValueOptions<TValue>;

  type UpdateOperationsForRootObject =
    UpdateOperationsForValueOptions<object> & {
      isRootObject: true;
      parentPropertyNames?: undefined;
    };

  type UpdateOperationsForNonRootObject =
    UpdateOperationsForValueOptions<object> & {
      isRootObject?: false;
      parentPropertyNames: Array<string>;
    };

  type UpdateOperationsForObjectValueOptions =
    | UpdateOperationsForRootObject
    | UpdateOperationsForNonRootObject;

  interface MakeParseItInsertOperationsOptions {
    linkId: number;
  }
};
