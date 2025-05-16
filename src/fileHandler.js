import path from "path";

import runCommand from "./utils/runCommand.js";
import askToIa from "./utils/askToIA.js";
import log from "./utils/logger.js";

import Context from "./entities/context.js";


export default async function fileHadler(file) {
  console.group(file.name);
 

  try {
   

    await file.loadContent();
  

    log.debug(file.content);

    if (file.content.block && !Context.ignoreBlocked) {
      log.warn(`BLOCKED ${path.join(file.parentPath, file.name)}`);

      console.groupEnd(file.name);
      return false;
    }

    log.msg(`File ${file.name} -> New File ${file.newFileName}`);

    log.msg(`WORKING ${path.join(file.parentPath, file.name)}`);

    const generatedCode = await askToIa(file.content, Context.generalConfig, file.content.test || true );

    const jsonGeneratedCode = JSON.parse(
      generatedCode
        .replace("```json", "")
        .replace("```", "")
        .replaceAll("\n", "")
    );

    // src
    file.persistSrcFile(jsonGeneratedCode.code);

    // test
    if(jsonGeneratedCode.test){ 
      file.persistTestFile(jsonGeneratedCode.test);
    }

    if (jsonGeneratedCode.externals) {
      await runCommand(Context.projectFolder, jsonGeneratedCode.externals);
    }

    return true;
  } catch (error) {
    throw new Error(
      `Error al procesar el archivo "${file.name}": ${error.message}`
    );
  } finally {
    console.groupEnd(file.name);
  }
}
