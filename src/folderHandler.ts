import fs from "fs";
import path from "node:path";
import { DEFAULTS } from "./constants.js";
import File from "./entities/File.js";
import setDirection from "./setDirection.js";

export default async function folderHandler(fileHandler: (file: File) => void, currentFolder: string) {

  await fs.readdir(
    currentFolder,
    { withFileTypes: true },
    async (err, files) => {

      if (err) {
        throw new Error(
          `Error reading folder ${DEFAULTS.promptFolder}: ${err.message}`
        );
      }


      for await (const file of files) {
        if (file.isDirectory()) {
          const fullPath = path.join(file.parentPath, file.name);

          await folderHandler(fileHandler, fullPath);
        }
        if (file.isFile()) {
          await setDirection(new File(file));
          
        }
      }
    }
  );
}
