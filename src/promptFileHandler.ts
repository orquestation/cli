import path from "path";

import runCommand from "./utils/runCommand.js";
import osdToCodeAI from "./utils/osdToCodeAI.js";
import log from "./utils/logger.js";

import Context from "./entities/Context.js";
import { IFile } from "./entities/File.js";

export default async function fileHadler(PromptFile:IFile) {
  console.group(PromptFile.name);
 

  try {
   

    await PromptFile.loadContent();
    await PromptFile.parseContent();
  

    log.debug(PromptFile.content);

    if (PromptFile.content.block && !Context.ignoreBlocked) {
      log.warn(`BLOCKED ${path.join(PromptFile.parentPath, PromptFile.name)}`);

      console.groupEnd();
      return false;
    }

    log.msg(`File ${PromptFile.name} -> New File ${PromptFile.newFileName}`);

    log.msg(`WORKING ${path.join(PromptFile.parentPath, PromptFile.name)}`);

    const generatedCode = await osdToCodeAI(PromptFile.content.prompt, Context.generalConfig, PromptFile.content.test || true );

    const jsonGeneratedCode = JSON.parse(
      generatedCode
        .replace("```json", "")
        .replace("```", "")
        .replaceAll("\n", "")
    );

    // src
    PromptFile.persistSrcFile(jsonGeneratedCode.code);

    // test
    if(jsonGeneratedCode.test){ 
      PromptFile.persistTestFile(jsonGeneratedCode.test);
    }

    if (jsonGeneratedCode.externals) {
      await runCommand(Context.projectFolder, jsonGeneratedCode.externals);
    }

    return true;
  } catch (error:unknown) {
    throw new Error(
      `Error al procesar el archivo "${PromptFile.name}": ${(error as Error).message}`
    );
  } finally {
    console.groupEnd();
  }
}
