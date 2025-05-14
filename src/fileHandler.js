import fs from "fs";
import path from "path";

import YML from "yaml";

import runCommand from "./runCommand.js";
import askToIa from "./askToIA.js";
import persistFile from "./persistFile.js";
import log from "./logger.js";

import Context from "./context.js";
import { DEFAULTS } from "./constants.js";

function getFolderStructure(rootPath, filePath) {
  return filePath.replace(rootPath, "");
}

export default async function fileHadler(file) {
  console.group(file.name);
  const newFileName = `${file.name.split(DEFAULTS.extensionPrompt)[0]}.${
    Context.generalConfig.language.extension
  }`;

  const filePath = path.join(file.parentPath, file.name);

  const srcFilePath = path.join(
    Context.srcFolder,
    path.join(
      getFolderStructure(Context.promptFolder, file.parentPath),
      newFileName
    )
  );

  const testFilePath = path.join(
    Context.testFolder,
    path.join(
      getFolderStructure(Context.promptFolder, file.parentPath),
      newFileName
    )
  );

  try {
    let fileContent;

    switch (path.extname(file.name)) {
      case ".json":
        fileContent = JSON.parse(await fs.readFileSync(filePath, "utf8"));
        break;
      case ".yml":
      case ".yaml":
        fileContent = YML.parse(await fs.readFileSync(filePath, "utf8"));
        break;
    }

    log.debug(fileContent);

    if (fileContent.block && !Context.ignoreBlocked) {
      log.warn(`BLOCKED ${path.join(file.parentPath, file.name)}`);

      console.groupEnd(file.name);
      return false;
    }

    log.msg(`File ${file.name} -> New File ${newFileName}`);

    log.msg(`WORKING ${path.join(file.parentPath, file.name)}`);

    const generatedCode = await askToIa(fileContent, Context.generalConfig);

    const jsonGeneratedCode = JSON.parse(
      generatedCode
        .replace("```json", "")
        .replace("```", "")
        .replaceAll("\n", "")
    );

    // src
    await persistFile(srcFilePath, jsonGeneratedCode?.code);

    // test
    await persistFile(testFilePath, jsonGeneratedCode?.test);

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
