import { generateApolloClient } from "@deep-foundation/hasura/client.js";
import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";
import assert from "assert";
import {
  DeepClient,
  DeepClientOptions,
  SerialOperation,
} from "@deep-foundation/deeplinks/imports/client.js";
import { callClientHandler } from "../call-client-handler.js";
import {
  createObjectToLinksConverterDecorator,
  ObjectToLinksConverterDecorator,
} from "../create-object-to-links-converter-decorator.js";
import { debug } from "../debug.js";
import { PACKAGE_NAME } from "../package-name.js";
import dotenv from "dotenv";
import {
  AllowedArray,
  AllowedObject,
  AllowedValue,
} from "../allowed-values.js";
import { pascalCase } from "case-anything";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks.js";
import { createSerialOperation } from "@deep-foundation/deeplinks/imports/gql/serial.js";
import { BoolExpLink } from "@deep-foundation/deeplinks/imports/client_types.js";
dotenv.config({
  path: "./.env.test.local",
});

const molduleLog = debug("test");

export const REQUIRED_PROCESS_ENVS = {
  graphqlPath: "GRAPHQL_PATH",
  ssl: "SSL",
  token: "TOKEN",
};

const graphqlUrl = new URL(process.env[REQUIRED_PROCESS_ENVS.graphqlPath]!);
const graphQlPath =
  graphqlUrl.host + graphqlUrl.pathname + graphqlUrl.search + graphqlUrl.hash;
const ssl = process.env[REQUIRED_PROCESS_ENVS.ssl]! === "true";
const token = process.env[REQUIRED_PROCESS_ENVS.token]!;

let apolloClient: ApolloClient<InMemoryCache>;
let decoratedDeep: ObjectToLinksConverterDecorator<DeepClient>;

const REQUIRED_PACKAGES_IN_MINILINKS = ["@deep-foundation/core", PACKAGE_NAME];

apolloClient = generateApolloClient({
  path: graphQlPath,
  ssl,
  token,
  ws: true,
});
const deep = new DeepClient({ apolloClient });
decoratedDeep = createObjectToLinksConverterDecorator(deep);
await decoratedDeep.applyRequiredPackagesInMinilinks();

const { data: requiredPackageLinks } = await deep.select({
  up: {
    tree_id: {
      _id: ["@deep-foundation/core", "containTree"],
    },
    parent: {
      _or: REQUIRED_PACKAGES_IN_MINILINKS.map((packageName) => ({
        id: {
          _id: [packageName],
        },
      })),
    },
  },
});
decoratedDeep.minilinks.apply(requiredPackageLinks);
// console.log(decoratedDeep.minilinks.links.find(link => link.value?.value === 'clientHandler'))
await test();

async function test() {
  await stringPropertyTest();
  await numberPropertyTest();
  await booleanPropertyTest();
  await arrayPropertyTest();
  await objectPropertyWithStringPropertyTest();
  await objectPropertyWithArrayOfStringsPropertyTest();
  await objectPropertyWithArrayOfArraysOfStringsPropertyTest();
  await objectPropertyWithArrayOfObjectsPropertyTest();
  await objectPropertyWithObjectPropertyTest();
  await objectPropertyWithObjectPropertyWithArrayPropertyTest();
  await customRootLinkTest();
  await customMethodMakeInsertoperationsForBooleanValue();
  await treeTest();
  await updateObjectPropertyWithObjectPropertyTest();
  await customResultLinkTest();
  await parseItTest();
  await parseItWithDifferentResultLinkResultTest();
}

async function parseItTest() {
  const propertyKey = "myStringKey";
  const propertyValue = "myStringValue";
  const {
    data: [rootLink],
  } = await deep.insert(
    {
      type_id: await deep.id(
        "@deep-foundation/object-to-links-async-converter",
        "Root",
      ),
      object: {
        data: {
          value: {
            [propertyKey]: propertyValue,
          },
        },
      },
    },
    {
      returning: deep.linksSelectReturning,
    },
  );
  const {
    data: [parseItLink],
  } = await deep.insert(
    {
      type_id: await deep.id(
        "@deep-foundation/object-to-links-async-converter",
        "ParseIt",
      ),
      from_id: rootLink.id,
      to_id: rootLink.id,
    },
    {
      returning: deep.linksSelectReturning,
    },
  );

  await deep.await(parseItLink.id);

  await checkProperty({
    parentLink: rootLink as Link<number>,
    name: propertyKey,
    value: propertyValue,
  });

  const {
    data: [hasResultLink],
  } = await deep.select({
    type_id: {
      _id: ["@deep-foundation/object-to-links-async-converter", "HasResult"],
    },
    from_id: rootLink.id,
    to_id: rootLink.id,
  });
  assert.notEqual(hasResultLink, undefined);
}

async function parseItWithDifferentResultLinkResultTest() {
  const propertyKey = "myStringKey";
  const propertyValue = "myStringValue";
  const {
    data: [rootLink],
  } = await deep.insert(
    {
      type_id: await deep.id(
        "@deep-foundation/object-to-links-async-converter",
        "Root",
      ),
      object: {
        data: {
          value: {
            [propertyKey]: propertyValue,
          },
        },
      },
    },
    {
      returning: deep.linksSelectReturning,
    },
  );

  const {
    data: [resultLink],
  } = await deep.insert(
    {
      type_id: await deep.id("@deep-foundation/core", "Type"),
    },
    {
      returning: deep.linksSelectReturning,
    },
  );

  const {
    data: [parseItLink],
  } = await deep.insert(
    {
      type_id: await deep.id(
        "@deep-foundation/object-to-links-async-converter",
        "ParseIt",
      ),
      from_id: rootLink.id,
      to_id: resultLink.id,
    },
    {
      returning: deep.linksSelectReturning,
    },
  );

  await deep.await(parseItLink.id);

  await checkProperty({
    parentLink: resultLink as Link<number>,
    name: propertyKey,
    value: propertyValue,
  });

  const {
    data: [hasResultLink],
  } = await deep.select({
    type_id: {
      _id: ["@deep-foundation/object-to-links-async-converter", "HasResult"],
    },
    from_id: rootLink.id,
    to_id: resultLink.id,
  });
  assert.notEqual(hasResultLink, undefined);
}

async function customResultLinkTest() {
  const propertyKey = "myStringKey";
  const propertyValue = "myStringValue";
  const {
    data: [{ id: resultLinkId }],
  } = await deep.insert({
    type_id: await deep.id("@deep-foundation/core", "Type"),
  });
  await clientHandlerTests({
    propertyKey,
    propertyValue,
    resultLinkId,
  });
}

async function updateObjectPropertyWithObjectPropertyTest() {
  const {
    data: [{ id: rootLinkId }],
  } = await deep.insert({
    type_id: await deep.id("@deep-foundation/core", "Type"),
  });
  const propertyKey = "myObjectKey";
  const propertyValue = {
    myObjectKey: {
      myStringKey: "myStringValue",
    },
  };
  await clientHandlerTests({
    propertyKey,
    propertyValue,
    rootLinkId,
  });
  const newPropertyValue = {
    myStringKey: "myNewStringValue",
    myStringKey1: "myNewStringValue1",
  };
  await clientHandlerTests({
    propertyKey,
    propertyValue: newPropertyValue,
    rootLinkId,
  });
  const {
    data: [myStringKeyLink],
  } = await deep.select({
    id: {
      _id: [rootLinkId, "myObjectKey", "myStringKey"],
    },
  });
  if (!myStringKeyLink) {
    throw new Error(`Failed to find myStringKeyLink`);
  }
  assert.equal(myStringKeyLink.value?.value, newPropertyValue.myStringKey);
  const {
    data: [myStringKey1Link],
  } = await deep.select({
    id: {
      _id: [rootLinkId, "myObjectKey", "myStringKey1"],
    },
  });
  assert.equal(myStringKey1Link.value?.value, newPropertyValue.myStringKey1);
}

async function treeTest() {
  const {
    data: [{ id: rootLinkId }],
  } = await deep.insert({
    type_id: await deep.id("@deep-foundation/core", "Type"),
  });
  const propertyKey = "myObjectKey";
  const propertyValue = {
    myObjectKey: {
      myStringKey: "myStringValue",
    },
  };
  await clientHandlerTests({
    propertyKey,
    propertyValue,
    rootLinkId,
  });
  const { data: containTreeLinkDownToRoot } = await deep.select({
    up: {
      tree_id: {
        _id: ["@deep-foundation/core", "containTree"],
      },
      parent_id: rootLinkId,
    },
  });
  assert.notStrictEqual(containTreeLinkDownToRoot, undefined);
  assert.equal(
    containTreeLinkDownToRoot.length,
    1 + // root link
      1 + // object link
      1 + // contain for object link
      1 + // object link
      1 + // contain for object link
      1 + // string link
      1, // contain for string link
  );
}

async function customMethodMakeInsertoperationsForBooleanValue() {
  const propertyKey = "myStringKey";
  const propertyValue = true;
  const {
    data: [{ id: rootLinkId }],
  } = await deep.insert({
    type_id: await deep.id("@deep-foundation/core", "Type"),
  });
  await clientHandlerTests({
    propertyKey,
    propertyValue,
    rootLinkId,
    customMethods: {
      makeInsertOperationsForBooleanValue,
    },
  });
  const {
    data: [propertyLink],
  } = await deep.select({
    id: {
      _id: [rootLinkId, propertyKey],
    },
  });
  assert.equal(propertyLink.value?.value, propertyValue.toString());

  async function makeInsertOperationsForBooleanValue(
    this: any,
    options: {
      parentLinkId: number;
      linkId: number;
      value: boolean;
      name: string;
    },
  ) {
    const operations: Array<SerialOperation> = [];
    const { value, parentLinkId, linkId, name } = options;
    const log = molduleLog.extend(makeInsertOperationsForBooleanValue.name);
    log({ options });

    log({ this: this });
    const linkInsertSerialOperation = createSerialOperation({
      type: "insert",
      table: "links",
      objects: {
        id: linkId,
        type_id: await deep.id(this.deep.linkId!, pascalCase(typeof value)),
        from_id: parentLinkId,
        to_id: await deep.id("@deep-foundation/boolean", value.toString()),
      },
    });
    operations.push(linkInsertSerialOperation);
    log({ linkInsertSerialOperation });

    const stringInsertSerialOperation = createSerialOperation({
      type: "insert",
      table: "strings",
      objects: {
        link_id: linkId,
        value: value.toString(),
      },
    });
    operations.push(stringInsertSerialOperation);
    log({ stringInsertSerialOperation });

    const containInsertSerialOperation = createSerialOperation({
      type: "insert",
      table: "links",
      objects: {
        // TODO: Replace id with idLocal when it work properly
        type_id: await deep.id("@deep-foundation/core", "Contain"),
        from_id: parentLinkId,
        to_id: linkId,
        string: {
          data: {
            value: name,
          },
        },
      },
    });
    operations.push(containInsertSerialOperation);
    log({ containInsertSerialOperation });

    log({ operations });

    return operations;
  }
}

async function customRootLinkTest() {
  const propertyKey = "myStringKey";
  const propertyValue = "myStringValue";
  const {
    data: [{ id: rootLinkId }],
  } = await deep.insert({
    type_id: await deep.id("@deep-foundation/core", "Type"),
  });
  await clientHandlerTests({
    propertyKey,
    propertyValue,
    rootLinkId,
  });
}

async function stringPropertyTest() {
  const propertyKey = "myStringKey";
  const propertyValue = "myStringValue";
  await clientHandlerTests({
    propertyKey,
    propertyValue,
  });
}

async function numberPropertyTest() {
  const propertyKey = "myStringKey";
  const propertyValue = 123;
  await clientHandlerTests({
    propertyKey,
    propertyValue,
  });
}

async function booleanPropertyTest() {
  const propertyKey = "myBooleanKey";
  const propertyValue = true;
  await clientHandlerTests({
    propertyKey,
    propertyValue,
  });
}

async function arrayPropertyTest() {
  const propertyKey = "myArrayKey";
  const propertyValue = ["myString1", "myString2"];
  await clientHandlerTests({
    propertyKey,
    propertyValue,
  });
}

async function objectPropertyWithStringPropertyTest() {
  const propertyKey = "myObjectKey";
  const propertyValue = {
    myStringKey: "myStringValue",
  };
  await clientHandlerTests({
    propertyKey,
    propertyValue,
  });
}

async function objectPropertyWithArrayOfStringsPropertyTest() {
  const propertyKey = "myObjectKey";
  const propertyValue = {
    myArrayKey: ["myString1", "myString2"],
  };
  await clientHandlerTests({
    propertyKey,
    propertyValue,
  });
}

async function objectPropertyWithArrayOfArraysOfStringsPropertyTest() {
  const propertyKey = "myObjectKey";
  const propertyValue = {
    myArrayKey: [
      ["myString1", "myString2"],
      ["myString1", "myString2"],
    ],
  };
  await clientHandlerTests({
    propertyKey,
    propertyValue,
  });
}

async function objectPropertyWithArrayOfObjectsPropertyTest() {
  const propertyKey = "myObjectKey";
  const propertyValue = {
    myArrayKey: [
      {
        myStringKey: "myStringValue",
      },
      {
        myStringKey: "myStringValue",
      },
    ],
  };
  await clientHandlerTests({
    propertyKey,
    propertyValue,
  });
}

async function objectPropertyWithObjectPropertyTest() {
  const propertyKey = "myObjectKey";
  const propertyValue = {
    myObjectKey: {
      myStringKey: "myStringValue",
    },
  };
  await clientHandlerTests({
    propertyKey,
    propertyValue,
  });
}

async function objectPropertyWithObjectPropertyWithArrayPropertyTest() {
  const propertyKey = "myObjectKey";
  const propertyValue = {
    myObjectKey: {
      myStringKey: ["myStringValue", "myStringValue"],
    },
  };
  await clientHandlerTests({
    propertyKey,
    propertyValue,
  });
}

async function clientHandlerTests(options: {
  propertyKey: string;
  propertyValue: AllowedValue;
  rootLinkId?: number;
  customMethods?: Record<string, Function>;
  resultLinkId?: number;
}) {
  const log = molduleLog.extend("clientHandlerTests");
  const { propertyKey: propertyKey, propertyValue: propertyValue } = options;
  const packageDeepClientOptions: DeepClientOptions = {
    apolloClient,
    ...(await decoratedDeep.login({
      linkId: decoratedDeep.objectToLinksConverterPackage.idLocal(),
    })),
  };
  const packageDeep = new DeepClient(packageDeepClientOptions);
  const obj = {
    [propertyKey]: propertyValue,
  };

  const clientHandlerResult = await callClientHandler({
    deep: decoratedDeep,
    linkId: decoratedDeep.objectToLinksConverterPackage.clientHandler.idLocal(),
    args: [
      {
        deep: packageDeep,
        obj: obj,
        rootLinkId: options.rootLinkId,
        resultLinkId: options.resultLinkId,
        customMethods: options.customMethods,
      },
    ],
  });
  log({ clientHandlerResult });
  if (clientHandlerResult.error) throw clientHandlerResult.error;
  assert.notStrictEqual(clientHandlerResult.result?.rootLinkId, undefined);
  const { rootLinkId, resultLinkId } = clientHandlerResult.result;
  if (options.rootLinkId) {
    assert.equal(rootLinkId, options.rootLinkId);
  }
  if (options.resultLinkId) {
    assert.equal(resultLinkId, options.resultLinkId);
  }
  const {
    data: [rootLinkFromSelect],
  } = await decoratedDeep.select(rootLinkId);
  assert.notStrictEqual(rootLinkFromSelect, undefined);

  const {
    data: [resultLinkFromSelect],
  } = await decoratedDeep.select(resultLinkId);
  assert.notStrictEqual(resultLinkFromSelect, undefined);

  const hasResultSelectData: BoolExpLink = {
    type_id: {
      _id: ["@deep-foundation/object-to-links-async-converter", "HasResult"],
    },
    from_id: rootLinkId,
    to_id: resultLinkId,
  };
  const {
    data: [hasResultLink],
  } = await deep.select(hasResultSelectData);
  if (!hasResultLink) {
    throw new Error(
      `Failed to find hasResultLink by using select with query: ${JSON.stringify(
        hasResultSelectData,
        null,
        2,
      )}`,
    );
  }

  const { data: containTreeLinksDownToResult } = await decoratedDeep.select({
    up: {
      tree_id: {
        _id: ["@deep-foundation/core", "containTree"],
      },
      parent_id: resultLinkId,
    },
  });
  assert.notStrictEqual(containTreeLinksDownToResult, undefined);
  assert.notEqual(containTreeLinksDownToResult.length, 0);

  await checkProperty({
    name: propertyKey,
    parentLink: resultLinkFromSelect,
    value: propertyValue,
  });
}

async function checkStringOrNumberProperty(
  options: CheckStringOrNumberPropertyOptions,
) {
  const { value, parentLink, name } = options;

  const {
    data: [link],
  } = await deep.select({
    id: {
      _id: [parentLink.id, name],
    },
  });
  if (!link) {
    throw new Error(`Failed to find property`);
  }
  assert.equal(link.from_id, parentLink.id);
  assert.equal(link.to_id, parentLink.id);
  assert.equal(link.value?.value, value);
}

async function checkBooleanProperty(options: CheckBooleanPropertyOptions) {
  const { value, parentLink, name } = options;

  const {
    data: [link],
  } = await deep.select({
    id: {
      _id: [parentLink.id, name],
    },
  });
  if (!link) {
    throw new Error(`Failed to find property`);
  }
  assert.equal(link.from_id, parentLink.id);

  assert.equal(
    link.to_id,
    await deep.id("@deep-foundation/boolean", value.toString()),
  );
}

async function checkStringProperty(options: CheckStringPropertyOptions) {
  await checkStringOrNumberProperty(options);
}

async function checkNumberProperty(options: CheckNumberPropertyOptions) {
  await checkStringOrNumberProperty(options);
}

async function checkObjectProperty(options: CheckObjectPropertyOptions) {
  const { value, parentLink, name } = options;

  const {
    data: [objectLink],
  } = await deep.select({
    id: {
      _id: [parentLink.id, name],
    },
  });
  if (!objectLink) {
    throw new Error(`Failed to find property`);
  }

  assert.equal(objectLink.from_id, parentLink.id);
  assert.equal(objectLink.to_id, parentLink.id);

  for (const [propertyKey, propertyValue] of Object.entries(value)) {
    await checkProperty({
      parentLink: objectLink,
      value: propertyValue,
      name: propertyKey,
    });
  }
}

async function checkArrayProperty(options: CheckArrayPropertyOptions) {
  const { value, parentLink, name } = options;

  const {
    data: [arrayLink],
  } = await deep.select({
    id: {
      _id: [parentLink.id, name],
    },
  });
  for (let i = 0; i < value.length; i++) {
    const element = value[i];
    const {
      data: [elementLink],
    } = await deep.select({
      id: {
        _id: [arrayLink.id, i.toString()],
      },
    });
    if (!elementLink) {
      throw new Error(`Failed to find element`);
    }
    await checkProperty({
      parentLink: arrayLink,
      name: i.toString(),
      value: element,
    });
  }
}

async function checkProperty(options: CheckAnyPropertyOptions) {
  const { value } = options;

  if (typeof value === "string" || typeof value === "number") {
    await checkStringOrNumberProperty({
      ...options,
      value,
    });
  } else if (typeof value === "boolean") {
    await checkBooleanProperty({
      ...options,
      value,
    });
  } else if (Array.isArray(value)) {
    await checkArrayProperty({
      ...options,
      value,
    });
  } else if (typeof value === "object") {
    await checkObjectProperty({
      ...options,
      value,
    });
  }
}

type CheckPropetyOptions<TValue extends AllowedValue> = {
  value: TValue;
  parentLink: Link<number>;
  name: string;
};

type CheckAnyPropertyOptions = CheckPropetyOptions<AllowedValue>;
type CheckStringOrNumberPropertyOptions = CheckPropetyOptions<string | number>;
type CheckStringPropertyOptions = CheckPropetyOptions<string>;
type CheckNumberPropertyOptions = CheckPropetyOptions<number>;
type CheckBooleanPropertyOptions = CheckPropetyOptions<boolean>;
type CheckObjectPropertyOptions = CheckPropetyOptions<AllowedObject>;
type CheckArrayPropertyOptions = CheckPropetyOptions<AllowedArray>;
