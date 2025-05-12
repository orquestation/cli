import fs from "fs";
import path from "node:path";

import fileHandler from "./fileHandler.js";
import log from "./logger.js";

import Context from "./context.js";
import { DEFAULTS } from "./constants.js";

export default async function folderHandler(currentFolder) {
  await fs.readdir(
    currentFolder || Context.promptFolder,
    { withFileTypes: true },
    async (err, files) => {
      if (err) {
        throw new Error(
          `Error al leer la carpeta ${DEFAULTS.promptFolder}: ${err.message}`
        );
      }

      for await (const file of files) {
        if (file.isDirectory()) {
          const fullPath = path.join(file.parentPath, file.name);

          await folderHandler(fullPath);
        }
        if (file.isFile()) {
          await fileHandler(file);
        }
      }
    }
  );
}
