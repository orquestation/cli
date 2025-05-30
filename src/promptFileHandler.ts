import path from "path";

import runCommand from "./utils/runCommand.js";
import osdToCodeAI from "./utils/AI/osdToCodeAI.js";
import log from "./utils/logger.js";

import Context from "./entities/Context.js";
import { IFile } from "./entities/File.js";

export default async function fileHadler(PromptFile: IFile) {
  console.group(PromptFile.original.name);

  try {
    log.debug(PromptFile.content);

    if (PromptFile.content?.block && !Context.ignoreBlocked) {
      log.warn(
        `BLOCKED ${path.join(
          PromptFile.original.parentPath,
          PromptFile.original.name
        )}`
      );

      console.groupEnd();
      return false;
    }

    log.msg(
      `File ${PromptFile.original.name} -> New File ${PromptFile.src.name}`
    );

    log.msg(
      `WORKING ${path.join(
        PromptFile.original.parentPath,
        PromptFile.original.name
      )}`
    );

    const generatedCode = await osdToCodeAI(
      PromptFile.content?.prompt,
      Context.generalConfig,
      PromptFile.content?.test || true
    );

    const jsonGeneratedCode = JSON.parse(
      generatedCode
        .replace("```json", "")
        .replace("```", "")
        .replaceAll("\n", "")
    );

    // src
    PromptFile.persistSrcFile(jsonGeneratedCode.code);

    // test
    if (jsonGeneratedCode.test) {
      PromptFile.persistTestFile(jsonGeneratedCode.test);
    }

    if (jsonGeneratedCode.externals) {
      await runCommand(Context.projectFolder, jsonGeneratedCode.externals);
    }

    return true;
  } catch (error: unknown) {
    throw new Error(
      `Error al procesar el archivo "${PromptFile.original.name}": ${
        (error as Error).message
      }`
    );
  } finally {
    console.groupEnd();
  }
}
