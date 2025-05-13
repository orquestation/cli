import fs from "fs";
import path from "path";
import log from "./logger.js";

export default async function persistFile(filePath, content) {
  console.log({ filePath, content });
  try {
    const directory = path.dirname(filePath);

    if (!fs.existsSync(directory)) {
      try {
        await fs.promises.mkdir(directory, { recursive: true });
        log(`Directory created": ${directory}`, "msg");
      } catch (mkdirError) {
        throw new Error(`Error creating the file: ${mkdirError}`);
      }
    }
  } catch (error) {
    throw new Error(`Error accessing or creating the directory: ${mkdirError}`);
  }

  try {
    await fs.promises.writeFile(filePath, content);
    console.log(`File written: ${filePath}`);
  } catch (writeError) {
    throw new Error(`Error writing the file: ${writeError}`);
  }
}
