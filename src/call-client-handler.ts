import ts from "typescript";
import { DeepClientInstance } from "@deep-foundation/deeplinks/imports/client";

export async function callClientHandler(
  options: CallClientHandlerOptions,
): Promise<any> {
  const { linkId, deep, args } = options;
  console.log({ deep });
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

  const jsCode = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  }).outputText;

  const modifiedJsCode = `(${jsCode})(...${JSON.stringify(args)});`;

  return await eval(modifiedJsCode);
}

export interface CallClientHandlerOptions {
  deep: DeepClientInstance;
  linkId: number;
  args: Array<any>;
}
