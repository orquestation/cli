import path from "path";
import Context from "../entities/context.js";
import log from "../utils/logger.js";
import folderHandler from "../folderHandler.js";

export default async function processFiles(pathProject: string, ignoreBlocked: boolean) {
  const currentDir = pathProject ? path.resolve(pathProject) : process.cwd();

  try {
    Context.inti(currentDir);
    if (ignoreBlocked) Context.setIgnoreBlocked();
    folderHandler();
  } catch (e: unknown) {
    log.error((e as Error).message);
  }
}