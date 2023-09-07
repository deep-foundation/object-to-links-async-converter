import { generateApolloClient } from "@deep-foundation/hasura/client.js";
import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";
import "@testing-library/jest-dom";
import assert from "assert";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client.js";
import { callClientHandler } from "../src/call-client-handler.js";
import {
  createObjectToLinksConverterDecorator,
  ObjectToLinksConverterDecorator,
} from "../src/create-object-to-links-converter-decorator.js";
import { debug } from "../src/debug.js";

const graphQlPath = `${process.env.DEEPLINKS_HASURA_PATH!}/v1/graphql`;
const ssl = !!+process.env.DEEPLINKS_HASURA_SSL!;
const token = process.env.DEEPLINKS_HASURA_TOKEN!;

let apolloClient: ApolloClient<InMemoryCache>;
let deep: DeepClient;
let decoratedDeep: ObjectToLinksConverterDecorator<DeepClient>;

beforeAll(async () => {
  apolloClient = generateApolloClient({
    path: graphQlPath,
    ssl,
    token,
    ws: true,
  });
  deep = new DeepClient({ apolloClient });
  decoratedDeep = createObjectToLinksConverterDecorator(deep);

  const { data: corePackageLinks } = await deep.select({
    up: {
      tree_id: {
        _id: ["@deep-foundation/core", "containTree"],
      },
      parent_id: {
        _id: ["@deep-foundation/core"],
      },
    },
  });
  deep.minilinks.apply(corePackageLinks);
});

describe("without root link id with obj that has one string property", async function withoutRootLinkIdWithObjThatHasOneStringProperty() {
  const log = debug(withoutRootLinkIdWithObjThatHasOneStringProperty.name);
  const obj = {
    myStringKey: "myStringValue",
  };
  log({ obj });
  const clientHandlerResult = await callClientHandler({
    deep,
    linkId: decoratedDeep.objectToLinksConverterPackage.clientHandler.idLocal(),
    args: [
      {
        deep: deep,
        obj: obj,
      },
    ],
  });
  log(clientHandlerResult);
  const {
    data: [rootLink],
  } = await decoratedDeep.select(clientHandlerResult.rootLinkId);
  assert.notStrictEqual(rootLink, undefined);
  const {
    data: [stringLink],
  } = await decoratedDeep.select({
    type_id: decoratedDeep.objectToLinksConverterPackage.String.idLocal(),
    from_id: rootLink.id,
    to_id: rootLink.id,
  });
  assert.notStrictEqual(stringLink, undefined);
});
