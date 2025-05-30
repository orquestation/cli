import fs from "fs";
import path from "node:path";
import { DEFAULTS } from "./constants.js";
import File, { IFile } from "./entities/File.js";
import osdToDocAI from "./utils/AI/osdToDocAI.js";
import log from "./utils/logger.js";
import Context from "./entities/Context.js";
import persistFile from "./utils/persistFile.js";

export default async function osdToDoc(currentFolder: string) {
  // get all files
  const files = await osdToDocFolderHandler(currentFolder);

  // generate a string with all pormpts
  const allPrompts = files
    .map((file) => `# ${file.src.name}:\n\n${file.content?.prompt}`)
    .join("\n\n-------\n\n");

  // send to ia
  const generatedDocument = await osdToDocAI(allPrompts);

  // persist readme
  await persistFile(Context.readme, generatedDocument);
}

async function osdToDocFolderHandler(currentFolder: string) {
  const filesToProcess: IFile[] = [];

  try {
    const files = await fs.promises.readdir(currentFolder, {
      withFileTypes: true,
    });

    for await (const file of files) {
      if (file.isDirectory()) {
        const fullPath = path.join(file.parentPath, file.name);

        const files = await osdToDocFolderHandler(fullPath);
        filesToProcess.push(...files);
      }
      if (file.isFile()) {
        const fileReader = new File(file);
        await fileReader.loadContent();
        await fileReader.parseContent();

        filesToProcess.push(fileReader);
      }
    }
  } catch (e: unknown) {
    throw new Error(
      `Error reading folder ${DEFAULTS.promptFolder}: ${(e as Error).message}`
    );
  }

  return filesToProcess;
}
