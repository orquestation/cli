import fs from "fs";
import path from "path";

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
  const newFileName = file.name.replace(
    DEFAULTS.extensionPrompt,
    `.${Context.generalConfig.language.extension}`
  );

  log(`File ${file.name} -> New File ${newFileName}`, "msg");

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
    const fileContent = JSON.parse(await fs.readFileSync(filePath, "utf8"));
    log(fileContent, "debug");

    if (fileContent.block) {
      log(`BLOCKED ${path.join(file.parentPath, file.name)}`, "warn");
      return false;
    }

    log(`WORKING ${path.join(file.parentPath, file.name)}`, "msg");

    const generatedCode = await askToIa(fileContent, Context.generalConfig);
    console.log({ generatedCode });
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
    console.log(`Código generado guardado en: ${newFileName}`);
    return true;
  } catch (error) {
    throw new Error(
      `Error al procesar el archivo "${file.name}": ${error.message}`
    );
  }
}
