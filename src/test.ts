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
dotenv.config({
  path: "./.env.test.local",
});

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

withoutRootLinkIdWithObjThatHasOneStringProperty();

async function withoutRootLinkIdWithObjThatHasOneStringProperty() {
  const log = debug(withoutRootLinkIdWithObjThatHasOneStringProperty.name);
  const obj = {
    myStringKey: "myStringValue",
  };
  const packageDeepClientOptions: DeepClientOptions = {
    apolloClient,
    ...(await decoratedDeep.login({
      linkId: decoratedDeep.objectToLinksConverterPackage.idLocal(),
    })),
  };
  const packageDeep = new DeepClient(packageDeepClientOptions);
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
  const {
    data: [rootLink],
  } = await decoratedDeep.select(clientHandlerResult.result.rootLinkId);
  assert.notStrictEqual(rootLink, undefined);
  const {
    data: [stringLink],
  } = await decoratedDeep.select({
    type_id: decoratedDeep.objectToLinksConverterPackage.String.idLocal(),
    from_id: rootLink.id,
    to_id: rootLink.id,
  });
  assert.notStrictEqual(stringLink, undefined);
}
