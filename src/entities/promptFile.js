import Context from "./context.js";
import path from "node:path";
import { getFolderStructure } from "../utils/getFolderStructure.js";
import fs from "node:fs";
import YML from "yaml";

export default class PromptFile {
  name;
  parentPath;
  newFileName;
  absolutePath;

  srcFilePath;
  testFilePath;

  content;

  constructor(file) {
    this.name = file.name;
    this.parentPath = file.parentPath;
    this.newFileName = path.parse(file.name).name;
    this.absolutePath = path.join(file.parentPath, file.name);

    this.srcFilePath = path.join(
      Context.srcFolder,
      path.join(
        getFolderStructure(Context.promptFolder, file.parentPath),
        this.newFileName
      )
    );

    this.testFilePath = path.join(
      Context.testFolder,
      path.join(
        getFolderStructure(Context.promptFolder, file.parentPath),
        this.newFileName
      )
    );
  }

  async loadContent() {
    const fileContent = await fs.readFileSync(this.absolutePath, "utf8");
    // detect if fileContent is a json or a yml
    if (fileContent.startsWith("{") || fileContent.startsWith("[")) {
      this.content = JSON.parse(fileContent);
    } else {
      this.content = YML.parse(fileContent);
    }
  }

  async persistSrcFile(code) {
    try {
      await fs.writeFileSync(this.srcFilePath, code);
    } catch (e) {
      throw new Error(`Error writing src file "${this.srcFilePath}": ${e.message}`);
    }
  }

  async persistTestFile(test) {
    try {
      await fs.writeFileSync(this.testFilePath, test);
    } catch (e) {
      throw new Error(`Error writing test file "${this.testFilePath}": ${e.message}`);
    }
  }
}
