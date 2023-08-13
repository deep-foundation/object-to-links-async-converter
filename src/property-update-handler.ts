import {
  DeepClient,
  SerialOperation,
  Table,
} from '@deep-foundation/deeplinks/imports/client';
import { BoolExpLink } from '@deep-foundation/deeplinks/imports/client_types';
import { Link } from '@deep-foundation/deeplinks/imports/minilinks';

async ({
  deep,
  data: { newLink, triggeredByLinkId},
}: {
  deep: DeepClient;
  data: { newLink: Link<number>, triggeredByLinkId: number};
}) => {
  const util = await import('util');
  const {camelCase} = await import("case-anything")
  const {createSerialOperation} = await import('@deep-foundation/deeplinks/imports/gql/index')
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
   
  async function main() {
    const log = getNamespacedLogger({ namespace: main.name });
    const containTypeLinkId = await deep.id("@deep-foundation/core", "Contain");
    const linkName = await getLinkName({containTypeLinkId,link: newLink});
    // TODO: Ensure this select works as intended
    const {data: treeLinksUp} = await deep.select({
      down: {
        tree_id: {
          _id: [deep.linkId, "Tree"]
        },
        link_id: newLink.id
      }
    })
    log({treeLinksUp})
    const serialOperations: Array<SerialOperation> = treeLinksUp.map(link => {
      return createSerialOperation({
        type: 'update',
        table: 'links',
        exp: {
          id: link.id,
        },
        value: {
          ...link.value?.value,
          [camelCase(linkName)]: newLink.value?.value
        }
      })
    })
    log({serialOperations})
    await deep.serial({
      operations: serialOperations
    })
  }

  async function getLinkName(options: {link: Link<number>, containTypeLinkId: number}){
    const log = getNamespacedLogger({ namespace: getLinkName.name });
    log({options})
    const {link, containTypeLinkId} = options;
    const containLinkSelectData: BoolExpLink = {
      type_id: containTypeLinkId,
      to_id: link.type_id,
    };
    log({containLinkSelectData})
    const {data: [containLink]} = await deep.select(containLinkSelectData)
    log({containLink})
    if(!containLink) {
      throw new Error(`Unable to find containLink for ${link.type_id}. Select with data ${JSON.stringify(containLinkSelectData, null, 2)} returned empty result`)
    }
    const linkName = containLink.value?.value;
    log({linkName});
    if(!linkName) {
      throw new Error(`Contain link ${containLink.id} has no value`)
    }
    return linkName;
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
};

