import { debug } from "./debug.js";
import { DeepClientInstance } from "@deep-foundation/deeplinks/imports/client.js";
import { ObjectToLinksConverterDecorator } from "./create-object-to-links-converter-decorator.js";

export async function applyRequiredPackagesInMinilinks<
  TDeepClient extends DeepClientInstance,
>(
  this: ObjectToLinksConverterDecorator<TDeepClient>,
): ApplyRequiredPackagesInMinilnksResult {
  const log = debug(applyRequiredPackagesInMinilinks.name);
  const { data: links } = await this.select({
    up: {
      tree_id: {
        _id: ["@deep-foundation/core", "containTree"],
      },
      parent: {
        _or: this.requiredPackagesInMinilinksToApply.map((packageName) => ({
          id: {
            _id: [packageName],
          },
        })),
      },
    },
  });

  const minilinksApplyResult = this.minilinks.apply(links);

  this.requiredPackagesInMinilinksToApply = [];

  return minilinksApplyResult;
}

export type ApplyRequiredPackagesInMinilnksResult = Promise<
  ReturnType<DeepClientInstance["minilinks"]["apply"]>
>;
