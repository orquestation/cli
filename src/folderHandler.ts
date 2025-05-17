import fs from "fs";
import path from "node:path";

import fileHandler from "./fileHandler.js";

import Context from "./entities/context.js";
import { DEFAULTS } from "./constants.js";
import PromptFile from "./entities/promptFile.js";

export default async function folderHandler(currentFolder?: string) {
  await fs.readdir(
    currentFolder || Context.promptFolder,
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

          await folderHandler(fullPath);
        }
        if (file.isFile()) {
          await fileHandler(new PromptFile(file));
        }
      }
    }
  );
}
