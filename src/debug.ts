import innerDebug from "debug";
import { PACKAGE_NAME } from "./package-name";

export function debug(namespace: string) {
  return innerDebug(`${PACKAGE_NAME}:${namespace}`);
}
