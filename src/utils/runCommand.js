import { execSync } from "node:child_process";
import log from "./logger.js";

export default async function runCommand(projectPath, externals) {
  if (externals.length) {
    log.warn(`INSTALLING ${externals.join(", ")}`);
    for await (const runComand of externals) {
      const { error } = await execSync(`cd ${projectPath} &&  ${runComand}`);

      if (error) log.error(`Installing has a error: ${error}`);
    }
  }
}
