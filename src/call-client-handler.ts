import ts from "typescript";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client";

export async function callClientHandler(options: CallClientHandlerOptions) {
  const { linkId, deep } = options;
  const code = await deep
    .select({
      type_id: deep.idLocal("@deep-foundation/core", "SyncTextFile"),
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

  const modifiedJsCode = `(${jsCode})();`;

  eval(modifiedJsCode);
}

export interface CallClientHandlerOptions {
  deep: DeepClient;
  linkId: number;
}
