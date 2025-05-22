import path from "path";

import runCommand from "./utils/runCommand.js";
import codeToOsdAI from "./utils/codeToOsdAI.js";
import log from "./utils/logger.js";

import Context from "./entities/Context.js";
import { IFile } from "./entities/File.js";

export default async function srcFileHadler(srcFile:IFile) {
  console.group(srcFile.name);

  try {
   

    await srcFile.loadContent();
  

    log.debug(srcFile.content);

    // if (srcFile.content.block && !Context.ignoreBlocked) {
    //   log.warn(`BLOCKED ${path.join(srcFile.parentPath, srcFile.name)}`);

    //   console.groupEnd();
    //   return false;
    // }

    

    const generatedPrompt = await codeToOsdAI(srcFile.rawContent);


    srcFile.persistPromptFile(generatedPrompt);

    
    // const jsonGeneratedCode = JSON.parse(
    //   generatedCode
    //     .replace("```json", "")
    //     .replace("```", "")
    //     .replaceAll("\n", "")
    // );

    // // src
    // srcFile.persistSrcFile(jsonGeneratedCode.code);

    // // test
    // if(jsonGeneratedCode.test){ 
    //   srcFile.persistTestFile(jsonGeneratedCode.test);
    // }

    // if (jsonGeneratedCode.externals) {
    //   await runCommand(Context.projectFolder, jsonGeneratedCode.externals);
    // }

    return true;
  } catch (error:unknown) {
    throw new Error(
      `Error al procesar el archivo "${srcFile.name}": ${(error as Error).message}`
    );
  } finally {
    console.groupEnd();
  }
}
