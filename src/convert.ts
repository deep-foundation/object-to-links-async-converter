import { debug } from "./debug.js";
import { DeepClientInstance } from "@deep-foundation/deeplinks/imports/client.js";
import { ObjectToLinksConverterDecorator } from "./create-object-to-links-converter-decorator.js";
import { callClientHandler } from "./call-client-handler.js";
import { Obj } from "./obj.js";

export async function convert<TDeepClient extends DeepClientInstance>(
  this: ObjectToLinksConverterDecorator<TDeepClient>,
  options: ConvertOptions,
) {
  const log = debug(convert.name);
  const { rootLinkId, obj } = options;
  const result = await callClientHandler({
    deep: this,
    linkId: this.objectToLinksConverterPackage.parseItInsertHandler.idLocal(),
    args: [
      {
        rootLinkId,
        obj,
        deep: this,
      },
    ],
  });
  log({ result });
}

export interface ConvertOptions {
  rootLinkId: number;
  obj: Obj;
}
