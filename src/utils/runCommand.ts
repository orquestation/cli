import { execSync } from "node:child_process";
import log from "./logger.js";

// install dependencies
export default async function runCommand(
  projectPath: string,
  externals: string[]
) {
  if (externals.length) {
    log.warn(`INSTALLING ${externals.join(", ")}`);
    for await (const runComand of externals) {
      try {
        await execSync(`cd ${projectPath} &&  ${runComand}`);
      } catch (e: unknown) {
        log.error(`Installing has a error: ${(e as Error).message}`);
      }
    }
  }
}
