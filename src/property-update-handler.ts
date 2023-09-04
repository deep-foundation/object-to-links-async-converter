import {
  DeepClient,
  SerialOperation,
  Table,
} from "@deep-foundation/deeplinks/imports/client.js";
import { BoolExpLink } from "@deep-foundation/deeplinks/imports/client_types.js";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks.js";

async ({
  deep,
  data: { newLink, triggeredByLinkId },
}: {
  deep: DeepClient;
  data: { newLink: Link<number>; triggeredByLinkId: number };
}) => {
  const util = await import("util");
  const { camelCase } = await import("case-anything");
  const { createSerialOperation } = await import(
    "@deep-foundation/deeplinks/imports/gql/index.js"
  );
  const logs: Array<any> = [];
  const DEFAULT_LOG_DEPTH = 3;

  class PropertyUpdateHandler {
    async handleUpdate() {
      const log = PropertyUpdateHandler.getNamespacedLogger({
        namespace: this.handleUpdate.name,
      });
      const linkName = await deep.name(newLink);
      if (!linkName) {
        throw new Error(`Failed to get name of link ${newLink.id}`);
      }
      // TODO: Ensure this select works as intended
      const { data: treeLinksUp } = await deep.select({
        down: {
          tree_id: {
            _id: [deep.linkId, "PropertiesTree"],
          },
          link_id: newLink.id,
        },
      });
      log({ treeLinksUp });
      const typeOfValue = this.getTypeOfValueForLink(newLink);
      const table = `${typeOfValue}s` as Table<"update">;
      // TODO: Think about should we update root object and insert ParseIt? How to prevent infinite cycle in this situation?
      const serialOperations: Array<SerialOperation> = treeLinksUp.map(
        (link) => {
          return createSerialOperation({
            type: "update",
            table,
            exp: {
              id: link.id,
            },
            value: {
              ...link.value?.value,
              [camelCase(linkName)]: newLink.value?.value,
            },
          });
        },
      );
      log({ serialOperations });

      const serialResult = await deep.serial({
        operations: serialOperations,
      });
      log({ serialResult });

      return serialResult;
    }
    getTypeOfValueForLink(link: Link<number>) {
      const log = PropertyUpdateHandler.getNamespacedLogger({
        namespace: `${this.getTypeOfValueForLink.name}`,
      });
      const [valueLink] = deep.minilinks.query({
        type_id: deep.idLocal("@deep-foundation/core", "Value"),
        from_id: link.type_id,
      });
      log({ valueLink });
      if (!valueLink) {
        throw new Error(`Failed to find value link for link ${link.type_id}`);
      }
      const typeOfValue = deep.nameLocal(valueLink.to_id!);
      log({ typeOfValue });
      if (!typeOfValue) {
        throw new Error(`Failed to get name of ${valueLink.to_id}`);
      }
      return typeOfValue;
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
        logs.push(`${PropertyUpdateHandler.name}:${namespace}: ${message}`);
      };
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
    const log = PropertyUpdateHandler.getNamespacedLogger({
      namespace: main.name,
    });
    const result = await new PropertyUpdateHandler().handleUpdate();
    log({ result });
    return result;
  }
};
