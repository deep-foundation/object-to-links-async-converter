import assert from "assert";
import dotenv from "dotenv";
import { REQUIRED_PROCESS_ENVS } from "./__tests__/required-process-envs";

const envFilePath = "./.env.test.local";
dotenv.config({ path: envFilePath });
if (process.env === undefined) throw new Error("process.env is undefined");
Object.values(REQUIRED_PROCESS_ENVS).forEach((env) => {
  assert.notEqual(process.env[env], undefined, `Set ${env} in ${envFilePath}`);
});
