import path from "path";
import log from "../utils/logger.js";
import Context from "../entities/Context.js";
import folderHandler from "../folderHandler.js";
import srcFileHandler from "../srcFileHandler.js";

export default function srcToOsd(pathProject: string) {
  const currentDir = pathProject ? path.resolve(pathProject) : process.cwd();   

  try {
    Context.inti(currentDir);     
    folderHandler(srcFileHandler, Context.srcFolder);
  } catch (e: unknown) {
    log.error((e as Error).message);
  }
}
