import { generateApolloClient } from "@deep-foundation/hasura/client.js";
import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";
import assert from "assert";
import {
  DeepClient,
  DeepClientOptions,
} from "@deep-foundation/deeplinks/imports/client.js";
import { callClientHandler } from "./call-client-handler.js";
import {
  createObjectToLinksConverterDecorator,
  ObjectToLinksConverterDecorator,
} from "./create-object-to-links-converter-decorator.js";
import { debug } from "./debug.js";
import { PACKAGE_NAME } from "./package-name.js";
import util from "util";
import stringify from "json-stringify-safe";
import dotenv from "dotenv";
import { AllowedArray, AllowedObject, AllowedValue } from "./allowed-values.js";
import { pascalCase } from "case-anything";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks.js";
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

async function clientHandlerTests(options: {
  propertyKey: string;
  propertyValue: AllowedValue;
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
      },
    ],
  });
  log({ clientHandlerResult });
  if (clientHandlerResult.error) throw clientHandlerResult.error;
  assert.notStrictEqual(clientHandlerResult.result?.rootLinkId, undefined);
  const { rootLinkId } = clientHandlerResult.result;
  const {
    data: [rootLinkFromSelect],
  } = await decoratedDeep.select(rootLinkId);
  assert.notStrictEqual(rootLinkFromSelect, undefined);
  const { data: containTreeLinksDownToRoot } = await decoratedDeep.select({
    up: {
      tree_id: {
        _id: ["@deep-foundation/core", "containTree"],
      },
      parent_id: rootLinkFromSelect.id,
    },
  });
  assert.notStrictEqual(containTreeLinksDownToRoot, undefined);
  assert.notEqual(containTreeLinksDownToRoot.length, 0);
  await checkProperty({
    name: propertyKey,
    parentLink: rootLinkFromSelect,
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
    await deep.id("@freephoenix888/boolean", pascalCase(value.toString())),
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

  for (const [propertyKey, propertyValue] of Object.entries(value)) {
    const {
      data: [propertyLink],
    } = await deep.select({
      id: {
        _id: [parentLink.id, propertyKey],
      },
    });
    await checkProperty({
      parentLink: propertyLink,
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
        _id: [parentLink.id, i.toString()],
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
