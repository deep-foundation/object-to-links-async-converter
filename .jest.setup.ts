import assert from "assert";
import dotenv from "dotenv";
import { REQUIRED_PROCESS_ENVS } from "./__tests/required-process-envs";

dotenv.config({ path: "./.env.test.local" });
if (process.env === undefined) throw new Error("process.env is undefined");
Object.values(REQUIRED_PROCESS_ENVS).forEach((env) => {
  assert.notEqual(process.env[env], undefined);
});
