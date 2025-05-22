import path from "path";

import runCommand from "./utils/runCommand.js";
import codeToOsdAI from "./utils/codeToOsdAI.js";
import log from "./utils/logger.js";

import Context from "./entities/Context.js";
import { IFile } from "./entities/File.js";

export default async function srcFileHadler(srcFile:IFile) {
  console.group(srcFile.original.name);

  try {
   
    log.debug(srcFile.content);

    const generatedPrompt = await codeToOsdAI(srcFile.rawContent);

    srcFile.persistPromptFile(generatedPrompt);

  
    return true;
  } catch (error:unknown) {
    throw new Error(
      `Error al procesar el archivo "${srcFile.original.name}": ${(error as Error).message}`
    );
  } finally {
    console.groupEnd();
  }
}
