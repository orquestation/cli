import Context from "./context.js";
import path from "node:path";
import { getFolderStructure } from "../utils/getFolderStructure.js";
import fs from "node:fs";
import YML from "yaml";


export interface IPromptFile {
  name: string;
  parentPath: string;
  newFileName: string;
  absolutePath: string;
  srcFilePath: string;
  testFilePath: string;
  content: any;
  loadContent: () => Promise<void>;
  persistSrcFile: (code: string) => Promise<void>;
  persistTestFile: (test: string) => Promise<void>;
}

export default class PromptFile implements IPromptFile {
  name:string;
  parentPath:string;
  newFileName:string;
  absolutePath:string;

  srcFilePath:string;
  testFilePath:string;

  content:TcontentFilePrompt = {prompt:""};

  constructor(file: { name: string; parentPath: string }) {
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

  async persistSrcFile(code: string) {
    try {
      await fs.writeFileSync(this.srcFilePath, code);
    } catch (e:unknown) {
      throw new Error(`Error writing src file "${this.srcFilePath}": ${(e as Error).message}`);
    }
  }

  async persistTestFile(test: string) {
    try {
      await fs.writeFileSync(this.testFilePath, test);
    } catch (e:unknown) {
      throw new Error(`Error writing test file "${this.testFilePath}": ${(e as Error).message}`);
    }
  }
}
