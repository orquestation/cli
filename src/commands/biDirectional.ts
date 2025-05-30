import path from "path";
import Context from "../entities/Context.js";
import log from "../utils/logger.js";
import folderHandler from "../folderHandler.js";
import promptFileHandler from "../promptFileHandler.js";

export default async function biDirectional(
  pathProject: string,
  ignoreBlocked: boolean
) {
  const currentDir = pathProject ? path.resolve(pathProject) : process.cwd();

  try {
    Context.inti(currentDir);
    if (ignoreBlocked) Context.setIgnoreBlocked();
    folderHandler(promptFileHandler, Context.promptFolder);
  } catch (e: unknown) {
    log.error((e as Error).message);
  }
}
