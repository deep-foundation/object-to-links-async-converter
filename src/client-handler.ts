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

async (options: { deep: DeepClient; rootLinkId?: number; obj: Obj }) => {
  const { deep, rootLinkId, obj } = options;
  const util = await import("util");
  const { createSerialOperation } = await import(
    "@deep-foundation/deeplinks/imports/gql/index.js"
  );
  const { format: prettyFormat } = await import("pretty-format");
  const { pascalCase } = await import("case-anything");
  const { default: debug } = await import("debug");
  const logs: Array<any> = [];
  const DEFAULT_DEBUG_OPTIONS = {
    maxDepth: 15,
    maxWidth: 100,
  };
  process.env.DEBUG_COLORS = "0";
  const log = debug("@deep-foundation/object-to-links-converter");
  log({ options });

  class ObjectToLinksConverter {
    reservedLinkIds: Array<number>;
    rootLink: Link<number>;
    obj: Obj;
    static requiredPackageNames = {
      core: "@deep-foundation/core",
      boolean: "@freephoenix888/boolean",
    };
    static requiredPackagesInMinilinks = {
      ...this.requiredPackageNames,
      objectToLinksConverter: "@freephoenix888/object-to-links-async-converter",
    };

    constructor(options: ObjectToLinksConverterOptions) {
      this.rootLink = options.rootLink;
      this.reservedLinkIds = options.reservedLinkIds;
      this.obj = options.obj;
    }

    static getNamespacedLogger(options: {
      namespace: string;
      maxDepth?: number;
      maxWidth?: number;
    }) {
      const getNamespacedLoggerLogger = debug(this.getNamespacedLogger.name);
      getNamespacedLoggerLogger({ options });
      const {
        namespace,
        maxDepth = DEFAULT_DEBUG_OPTIONS.maxDepth,
        maxWidth = DEFAULT_DEBUG_OPTIONS.maxWidth,
      } = options;
      const resultLogger = log.extend(
        `${ObjectToLinksConverter.name}:${namespace}`,
      );
      resultLogger.enabled = true;
      resultLogger.log = (...content: Array<any>) => {
        logs.push(...content);
      };
      return resultLogger;
      // return (content: any) => {
      //   const formattedContent = prettyFormat(content, {
      //     maxDepth: maxDepth,
      //     maxWidth: maxWidth,
      //     escapeString: false,
      //   })
      //   logs.push(`${namespace}:${formattedContent}`)
      // }
    }

    static async applyContainTreeLinksDownToParentToMinilinks(
      options: ApplyContainTreeLinksDownToParentToMinilinksOptions,
    ) {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace:
          ObjectToLinksConverter.applyContainTreeLinksDownToParentToMinilinks
            .name,
      });
      const links = (await this.getContainTreeLinksDownToParent({
        linkExp: options.linkExp,
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
        namespace: ObjectToLinksConverter.getContainTreeLinksDownToParent.name,
      });
      const { linkExp } = options;
      const query: BoolExpLink = {
        up: {
          tree_id: await deep.id("@deep-foundation/core", "containTree"),
          parent: linkExp,
        },
      };
      log({ query });
      const result = await deep.select(query);
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
        namespace: ObjectToLinksConverter.init.name,
      });
      const { obj } = options;
      const containTreeLinksDownToCoreAndThisPackageLinkApplyMinilinksResult =
        await this.applyContainTreeLinksDownToParentToMinilinks({
          linkExp: {
            _or: Object.values(
              ObjectToLinksConverter.requiredPackagesInMinilinks,
            ).map((packageName) => ({
              id: {
                _id: [packageName],
              },
            })),
          },
          minilinks: deep.minilinks,
        });
      log({ containTreeLinksDownToCoreAndThisPackageLinkApplyMinilinksResult });
      const rootLink: Link<number> = options.rootLinkId
        ? await deep.select(options.rootLinkId).then((result) => result.data[0])
        : await deep
            .insert(
              {
                // TODO: Replace id with idLocal when it work properly
                type_id: await deep.id(deep.linkId!, "Root"),
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
      const containTreeLinksDownToRootLinkApplyMinilinksResult =
        await this.applyContainTreeLinksDownToParentToMinilinks({
          linkExp: {
            id: rootLink.id,
          },
          minilinks: deep.minilinks,
        });
      log({ containTreeLinksDownToRootLinkApplyMinilinksResult });
      // const linkIdsToReserveCount = this.getLinksToReserveCount({value: obj});
      // log({linkIdsToReserveCount})
      // const reservedLinkIds = await deep.reserve(linkIdsToReserveCount);
      // log({reservedLinkIds})
      const converter = new this({
        reservedLinkIds: [],
        rootLink,
        obj,
      });
      log({ converter });
      return converter;
    }

    async convert() {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: "convert",
      });

      const operations = await this.makeUpdateOperationsForObjectValue({
        link: this.rootLink,
        value: this.obj,
        isRootObject: true,
      });
      log({ operations });

      const serialResult = await deep.serial({
        operations,
      });
      log({ serialResult });

      return {
        serialResult,
        rootLinkId,
      };
    }

    async getOptions(options: GetOptionsOptions): Promise<Options> {
      const { rootLinkId } = options;
      return {
        typesContainerLink: await this.getTypesContainer(),
      };
    }

    async getTypesContainer(): Promise<Options["typesContainerLink"]> {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: "getTypesContainer",
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
        namespace: ObjectToLinksConverter.getLinksToReserveCount.name,
      });
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
        namespace: `${"makeUpdateOperationsForPrimitiveValue"}`,
      });
      const { link, value } = options;
      const operations: Array<SerialOperation> = [];
      if (typeof value === "boolean") {
        operations.push(
          createSerialOperation({
            type: "update",
            table: "links",
            exp: {
              id: link.id,
            },
            value: {
              to_id: value
                ? await deep.id(
                    ObjectToLinksConverter.requiredPackageNames.boolean,
                    "True",
                  )
                : await deep.id(
                    ObjectToLinksConverter.requiredPackageNames.boolean,
                    "False",
                  ),
            },
          }),
        );
      } else {
        operations.push(
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

      return operations;
    }

    async makeUpdateOperationsForObjectValue(
      options: UpdateOperationsForObjectValueOptions,
    ) {
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: "makeUpdateOperationsForObjectValue",
      });
      const { link, value, isRootObject, parentPropertyNames = [] } = options;
      log({ options });
      const operations: Array<SerialOperation> = [];

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
        operations.push(linkUpdateOperation);
      }

      for (const [propertyKey, propertyValue] of Object.entries(value)) {
        log({ propertyKey, propertyValue });
        const propertyName = pascalCase(
          parentPropertyNames.join("") + propertyKey,
        );
        log({ propertyName });
        const [propertyLink] = deep.minilinks.query({
          id: {
            _id: [link.id, propertyKey],
          },
        });
        log({ propertyLink });
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
          operations.push(...propertyUpdateOperations);
        } else {
          if (
            typeof propertyValue !== "string" &&
            typeof propertyValue !== "number" &&
            typeof propertyValue !== "boolean"
          ) {
            log(
              `Skipping property ${propertyKey} because it is not string or number or boolean`,
            );
            continue;
          }

          log("TEMPORARY! REMOVE THIS!");
          log(`minilinks.links`, deep.minilinks.links);
          log(
            `package link`,
            deep.minilinks.query({
              id: deep.linkId!,
            }),
          );
          log(
            `contain to string`,
            deep.minilinks.query({
              // TODO: Replace id with idLocal when it work properly
              type_id: await deep.id("@deep-foundation/core", "Contain"),
              string: {
                value: "String",
              },
              from_id: deep.linkId!,
            }),
          );
          log(
            `contain to string`,
            deep.minilinks.query({
              id: {
                _id: [deep.linkId!, "String"],
              },
            }),
          );

          const propertyInsertoperations =
            await this.makeInsertOperationsForAnyValue({
              linkId: this.reservedLinkIds.pop()!,
              parentLinkId: link.id,
              // TODO: Replace id with idLocal when it work properly
              typeLinkId: await deep.id(
                deep.linkId!,
                pascalCase(typeof propertyValue),
              ),
              value: propertyValue,
            });
          log({ propertyInsertoperations });
          operations.push(...propertyInsertoperations);
        }

        log({ operations });
        return operations;
      }

      return operations;
    }

    async makeInsertoperationsForStringValue(
      options: MakeInsertoperationsForStringOptions,
    ) {
      return this.makeInsertoperationsForStringOrNumberValue(options);
    }
    async makeInsertoperationsForNumberValue(
      options: MakeInsertoperationsForNumberOptions,
    ) {
      return this.makeInsertoperationsForStringOrNumberValue(options);
    }
    async makeInsertoperationsForBooleanValue(
      options: MakeInsertoperationsForBooleanOptions,
    ) {
      const operations: Array<SerialOperation> = [];
      const { value, parentLinkId, linkId, typeLinkId } = options;
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: "makeInsertoperationsForStringValue",
      });

      const linkInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          id: linkId,
          type_id: typeLinkId,
          from_id: parentLinkId,
          to_id: value
            ? // TODO: Replace id with idLocal when it work properly
              await deep.id(
                ObjectToLinksConverter.requiredPackageNames.boolean,
                "True",
              )
            : // TODO: Replace id with idLocal when it work properly
              await deep.id(
                ObjectToLinksConverter.requiredPackageNames.boolean,
                "False",
              ),
        },
      });
      log({ linkInsertSerialOperation });
      operations.push(linkInsertSerialOperation);

      const containInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          // TODO: Replace id with idLocal when it work properly
          type_id: await deep.id("@deep-foundation/core", "Contain"),
          from_id: parentLinkId,
          to_id: linkId,
        },
      });
      log({ containInsertSerialOperation });
      operations.push(containInsertSerialOperation);

      log({ operations });
      return operations;
    }
    async makeInsertoperationsForStringOrNumberValue(
      options: MakeInsertoperationsForStringOrNumberOptions,
    ) {
      const operations: Array<SerialOperation> = [];
      const { value, parentLinkId, linkId, typeLinkId } = options;
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: "makeInsertoperationsForStringValue",
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
      operations.push(linkInsertSerialOperation);

      const stringValueInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: `${typeof value}s` as Table<"insert">,
        objects: {
          link_id: linkId,
          value: value,
        },
      });
      log({ stringValueInsertSerialOperation });
      operations.push(stringValueInsertSerialOperation);

      const containInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          // TODO: Replace id with idLocal when it work properly
          type_id: await deep.id("@deep-foundation/core", "Contain"),
          from_id: parentLinkId,
          to_id: linkId,
        },
      });
      log({ containInsertSerialOperation });
      operations.push(containInsertSerialOperation);

      log({ operations });
      return operations;
    }
    async makeInsertoperationsForObject(
      options: MakeInsertoperationsForObject,
    ) {
      const operations: Array<SerialOperation> = [];
      const { typeLinkId, value, linkId, parentLinkId } = options;
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: "makeInsertoperationsForStringValue",
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
      operations.push(linkInsertSerialOperation);

      const objectValueInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "objects",
        objects: {
          link_id: linkId,
          value: value,
        },
      });
      log({ objectValueInsertSerialOperation });
      operations.push(objectValueInsertSerialOperation);

      const containInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          // TODO: Replace id with idLocal when it work properly
          type_id: await deep.id("@deep-foundation/core", "Contain"),
          from_id: parentLinkId,
          to_id: linkId,
        },
      });
      log({ containInsertSerialOperation });
      operations.push(containInsertSerialOperation);

      for (const [propertyKey, propertyValue] of Object.entries(value)) {
        if (
          typeof propertyValue !== "string" ||
          typeof propertyValue !== "number" ||
          typeof propertyValue !== "boolean"
        ) {
          continue;
        }
        const propertyInsertOperations =
          await this.makeInsertOperationsForAnyValue({
            linkId: this.reservedLinkIds.pop()!,
            parentLinkId: linkId,
            // TODO: Replace id with idLocal when it work properly
            typeLinkId: await deep.id(
              deep.linkId!,
              pascalCase(typeof propertyValue),
            ),
            value: propertyValue,
          });
        operations.push(...propertyInsertOperations);
      }

      operations.push(containInsertSerialOperation);
      log({ operations });
      return operations;
    }
    async makeInsertOperationsForAnyValue<TValue extends Value>(
      options: MakeInsertoperationsForAnyValueOptions<TValue>,
    ) {
      const { value, parentLinkId, linkId } = options;
      const log = ObjectToLinksConverter.getNamespacedLogger({
        namespace: "makeInsertoperationsForAnyValue",
      });

      const operations: Array<SerialOperation> = [];
      if (typeof value === "string") {
        const inneroperations = await this.makeInsertoperationsForStringValue({
          ...options,
          value,
        });
        operations.push(...inneroperations);
      } else if (typeof value === "number") {
        const inneroperations = await this.makeInsertoperationsForNumberValue({
          ...options,
          value,
        });
        operations.push(...inneroperations);
      } else if (typeof value === "boolean") {
        const inneroperations = await this.makeInsertoperationsForBooleanValue({
          ...options,
          value,
        });
        operations.push(...inneroperations);
      } else if (typeof value === "object") {
        const inneroperations = await this.makeInsertoperationsForObject({
          ...options,
          value,
        });
        operations.push(...inneroperations);
      } else {
        throw new Error(
          `Unknown type of value ${value}: ${typeof value}. Only string, number, boolean, and object are supported`,
        );
      }

      const propertyInsertSerialOperation = createSerialOperation({
        type: "insert",
        table: "links",
        objects: {
          // TODO: Replace id with idLocal when it work properly
          type_id: await deep.id(deep.linkId!, "Property"),
          from_id: parentLinkId,
          to_id: linkId,
        },
      });
      log({ propertyInsertSerialOperation });
      operations.push(propertyInsertSerialOperation);

      return operations;
    }
  }

  try {
    const result = await main();
    return {
      result,
      logs: logs,
    };
  } catch (error) {
    return {
      error,
      logs: logs,
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

    const convertResult = await objectToLinksConverter?.convert();
    log({ convertResult });

    return convertResult;
  }
};

interface Obj {
  [key: string]: string | number | Obj | boolean;
}

type ApplyContainTreeLinksDownToParentToMinilinksOptions = Omit<
  GetContainTreeLinksDownToLinkOptions,
  "useMinilinks"
> & {
  minilinks: MinilinksResult<Link<number>>;
};

interface GetContainTreeLinksDownToLinkOptions {
  linkExp: BoolExpLink;
}

interface ObjectToLinksConverterOptions {
  rootLink: Link<number>;
  reservedLinkIds: Array<number>;
  obj: Obj;
}

interface ObjectToLinksConverterInitOptions {
  obj: Obj;
  rootLinkId?: number;
}
type MakeInsertoperationsForStringOrNumberOptions =
  MakeInsertoperationsForAnyValueOptions<string | number> & {
    value: string | number;
  };

type MakeInsertoperationsForStringOptions =
  MakeInsertoperationsForAnyValueOptions<string> & {
    value: string;
  };

type MakeInsertoperationsForNumberOptions =
  MakeInsertoperationsForAnyValueOptions<number> & {
    value: number;
  };

type MakeInsertoperationsForBooleanOptions =
  MakeInsertoperationsForAnyValueOptions<boolean> & {
    value: boolean;
  };

type MakeInsertoperationsForObject =
  MakeInsertoperationsForAnyValueOptions<object> & {
    value: object;
  };

type MakeInsertoperationsForAnyValueOptions<TValue extends Value> = {
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

type UpdateOperationsForRootObject = UpdateOperationsForValueOptions<object> & {
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
