import codeToOsdAI from "./utils/AI/codeToOsdAI.js";
import log from "./utils/logger.js";
import { IFile } from "./entities/File.js";

export default async function srcFileHadler(srcFile: IFile) {
  console.group(srcFile.original.name);

  try {
    log.debug(srcFile.content);

    const generatedPrompt = await codeToOsdAI(srcFile.rawContent);

    srcFile.persistOsdFile(generatedPrompt);

    return true;
  } catch (error: unknown) {
    throw new Error(
      `Error al procesar el archivo "${srcFile.original.name}": ${
        (error as Error).message
      }`
    );
  } finally {
    console.groupEnd();
  }
}
