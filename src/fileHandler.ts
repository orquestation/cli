import path from "path";

import runCommand from "./utils/runCommand.js";
import askToIa from "./utils/askToIA.js";
import log from "./utils/logger.js";

import Context from "./entities/context.js";
import { IPromptFile } from "./entities/promptFile.js";

export default async function fileHadler(PromptFile:IPromptFile) {
  console.group(PromptFile.name);
 

  try {
   

    await PromptFile.loadContent();
  

    log.debug(PromptFile.content);

    if (PromptFile.content.block && !Context.ignoreBlocked) {
      log.warn(`BLOCKED ${path.join(PromptFile.parentPath, PromptFile.name)}`);

      console.groupEnd();
      return false;
    }

    log.msg(`File ${PromptFile.name} -> New File ${PromptFile.newFileName}`);

    log.msg(`WORKING ${path.join(PromptFile.parentPath, PromptFile.name)}`);

    const generatedCode = await askToIa(PromptFile.content, Context.generalConfig, PromptFile.content.test || true );

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
