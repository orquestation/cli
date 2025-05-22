import fs from "fs";
import path from "path";
import log from "./logger.js";

export default async function persistFile(filePath: string, content: string) {
  try {
    const directory = path.dirname(filePath);

    if (!fs.existsSync(directory)) {
      try {
        await fs.promises.mkdir(directory, { recursive: true });
        log.msg(`Directory created": ${directory}`);
      } catch (mkdirError) {
        throw new Error(`Error creating the file: ${(mkdirError as Error).message}`);
      }
    }
  } catch (error: unknown) {
    throw new Error(`Error accessing or creating the directory: ${(error as Error).message}`);
  }

  try {
    await fs.promises.writeFile(filePath, content);
    log.msg(`File written: ${filePath}`);
  } catch (writeError: unknown) {
    throw new Error(`Error writing the file: ${(writeError as Error).message}`);
  }
}
