import innerDebug from "debug";

export function debug(namespace: string) {
  return innerDebug(`@deep-foundation/object-to-links-converter:${namespace}`);
}
