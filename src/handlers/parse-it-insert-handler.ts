import { DeepClient } from "@deep-foundation/deeplinks/imports/client.js";
import { Link } from "@deep-foundation/deeplinks/imports/minilinks.js";
import { DeepClientInstance } from "@deep-foundation/deeplinks/imports/client";

async (options: {
  deep: DeepClient;
  data: {
    newLink: Link<number>;
  };
}) => {
  const {
    deep,
    data: { newLink: parseItLink },
  } = options;
  const { default: ts } = await import("typescript");
  const { default: util } = await import("util");
  try {
    const result = await main();
    return {
      result: util.inspect(result, {
        maxArrayLength: null,
        depth: null,
      }),
    };
  } catch (error) {
    console.log("FreePhoenix error");
    console.dir({
      error: util.inspect(error, {
        maxArrayLength: null,
        depth: null,
      }),
    });
    throw {
      error: util.inspect(error, {
        maxArrayLength: null,
        depth: null,
      }),
    };
  }

  async function main() {
    const {
      data: [rootLink],
    } = await deep.select({
      id: parseItLink.from_id,
    });
    if (!rootLink) {
      throw new Error(`parseIt.to does not exist: ##${parseItLink.from_id}`);
    }

    let obj;
    if (typeof rootLink.value?.value === "object") {
      obj = rootLink.value?.value;
    } else if (typeof rootLink.value?.value === "string") {
      try {
        obj = JSON.parse(rootLink.value?.value);
      } catch (error) {
        throw new Error(
          `##${rootLink.id} must be valid JSON if it is a string`,
        );
      }
    } else {
      throw new Error(`##${rootLink.id} must have value`);
    }
    if (!obj) {
      throw new Error(`##${rootLink.id} must have value`);
    }

    const clientHandlerResult = await callClientHandler({
      deep,
      linkId: await deep.id(deep.linkId!, "clientHandler"),
      args: [
        {
          deep: deep,
          obj: obj,
          rootLinkId: rootLink.id,
          resultLinkId: parseItLink.to_id,
          // TODO?
          // customMethods: options.customMethods,
        },
      ],
    });

    return clientHandlerResult;
  }

  async function callClientHandler(
    options: CallClientHandlerOptions,
  ): Promise<any> {
    const { linkId, deep, args } = options;
    const code = await deep
      .select({
        in: {
          id: linkId,
        },
      })
      .then((result) => {
        const link = result.data[0];
        if (!link)
          throw new Error(`Unable to find SyncTextFile for ##${linkId}`);
        const code = link.value?.value;
        if (!code) throw new Error(`##${link.id} must have value`);
        return code;
      });

    const functionExpressionString = ts
      .transpileModule(code, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          sourceMap: true,
          target: ts.ScriptTarget.ESNext,
        },
      })
      .outputText.replace("export {}", "");
    const fn: Function = eval(functionExpressionString);

    const result = await fn(...args);
    return result;
  }

  interface CallClientHandlerOptions {
    deep: DeepClientInstance;
    linkId: number;
    args: Array<any>;
  }
};
