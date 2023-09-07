import innerDebug from "debug";
import { PACKAGE_NAME } from "./package-name.js";

export function debug(namespace: string) {
  return innerDebug(`${PACKAGE_NAME}:${namespace}`);
}
