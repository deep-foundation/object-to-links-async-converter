import ts from "typescript";
import { DeepClientInstance } from "@deep-foundation/deeplinks/imports/client";

export async function callClientHandler(
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
      if (!link) throw new Error(`Unable to find SyncTextFile for ##${linkId}`);
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

export interface CallClientHandlerOptions {
  deep: DeepClientInstance;
  linkId: number;
  args: Array<any>;
}
