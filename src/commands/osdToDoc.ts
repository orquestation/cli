import path from "path";
import Context from "../entities/Context.js";
import log from "../utils/logger.js";
import osdToFolderHandlerDoc from "../osdToDocfolderHandler.js";

export default async function osdToDoc(pathProject: string) {
  const currentDir = pathProject ? path.resolve(pathProject) : process.cwd();

  try {
    Context.inti(currentDir);
    // if (ignoreBlocked) Context.setIgnoreBlocked();
    osdToFolderHandlerDoc(Context.promptFolder);
  } catch (e: unknown) {
    log.error((e as Error).message);
  }
}
