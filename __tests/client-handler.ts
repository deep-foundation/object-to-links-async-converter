import { generateApolloClient } from "@deep-foundation/hasura/client.js";
import { ApolloClient, InMemoryCache } from "@apollo/client/index.js";
import "@testing-library/jest-dom";
import assert from "assert";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client.js";

const graphQlPath = `${process.env.DEEPLINKS_HASURA_PATH}/v1/graphql`;
if (process.env.DEEPLINKS_HASURA_SSL == null) {
  throw new Error("DEEPLINKS_HASURA_SSL is not defined");
}
const ssl = !!+process.env.DEEPLINKS_HASURA_SSL;
if (process.env.DEEPLINKS_HASURA_SECRET == null) {
  throw new Error("DEEPLINKS_HASURA_SECRET is not defined");
}
const secret = process.env.DEEPLINKS_HASURA_SECRET;
const ws = true;

let apolloClient: ApolloClient<InMemoryCache>;
let deep: DeepClient;

beforeAll(async () => {
  apolloClient = generateApolloClient({
    path: graphQlPath,
    ssl,
    secret,
    ws,
  });
  deep = new DeepClient({ apolloClient });

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

describe("client-handler", () => {
  throw new Error("Not implemented");
});
