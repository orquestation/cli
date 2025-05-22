import Context from "./Context.js";
import path from "node:path";
import { getFolderStructure } from "../utils/getFolderStructure.js";
import fs from "node:fs";
import YML from "yaml";
import { TcontentFilePrompt } from "../types/TcontentFilePrompt.js";
import persistFile from "../utils/persistFile.js";


export interface IFile {
  name: string;
  parentPath: string;
  newFileName: string;
  absolutePath: string;
  srcFilePath: string;
  testFilePath: string;
  rawContent:string;
  content: TcontentFilePrompt;
  promptFilePath: string;
  type: "prompt" | "src" | "test" | "unknown";
  loadContent: () => Promise<void>;
  parseContent: () => Promise<void>;
  persistSrcFile: (code: string) => Promise<void>;
  persistTestFile: (test: string) => Promise<void>;
  persistPromptFile: (prompt: string) => Promise<void>;
  detectType: () => void;
}

export default class File implements IFile {
  name:string;
  parentPath:string;
  newFileName:string;
  absolutePath:string;
  srcFilePath:string ="";
  testFilePath:string ="";
  rawContent:string = "";
  content:TcontentFilePrompt = {prompt:""};
  promptFilePath:string = "";
  type: "prompt" | "src" | "test" | "unknown" = "unknown";

  constructor(file: { name: string; parentPath: string }) {
    this.name = file.name;
    this.parentPath = file.parentPath;
    this.newFileName = path.parse(file.name).name;
    this.absolutePath = path.join(file.parentPath, file.name);

    this.detectType();

    if(this.type === "prompt") {
      this.promptFilePath =  path.join(file.parentPath, file.name);
    } else {
      this.promptFilePath = path.join(
        Context.promptFolder,
        path.join(
          getFolderStructure(Context.srcFolder, file.parentPath),
          `${this.name}${Context.extensionPrompt}`
        )
      );
    }

    if(this.type === "src") {
      this.srcFilePath = path.join(file.parentPath, file.name);
    } else {
      this.srcFilePath = path.join( 
        Context.srcFolder,
        path.join(
          getFolderStructure(Context.promptFolder, file.parentPath),
          this.newFileName
        )
      );
    }
   

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
    this.rawContent = fileContent;
  }

  async parseContent() {
    if (this.rawContent.startsWith("{") || this.rawContent.startsWith("[")) {
      this.content = JSON.parse(this.rawContent);
    } else {
      this.content = YML.parse(this.rawContent);
    }
  }


  async persistPromptFile(prompt: string) {

    const objectToPersist = YML.stringify({prompt})
    try {
      await persistFile(this.promptFilePath, objectToPersist);
    } catch (e:unknown) {
      throw new Error(`Error writing prompt file "${this.promptFilePath}": ${(e as Error).message}`);
    }
  }

  async persistSrcFile(code: string) {
   
    try {
      await persistFile(this.srcFilePath, code);
    } catch (e:unknown) {
      throw new Error(`Error writing src file "${this.srcFilePath}": ${(e as Error).message}`);
    }
  }

  async persistTestFile(test: string) {
     try {
      await persistFile(this.testFilePath, test)
    } catch (e:unknown) {
      throw new Error(`Error writing test file "${this.testFilePath}": ${(e as Error).message}`);
    }
  }

  detectType() {
    if (this.parentPath.includes(Context.promptFolder)) {
      this.type = "prompt";
    } else if (this.parentPath.includes(Context.srcFolder)) {
      this.type = "src";
    } else if (this.parentPath.includes(Context.testFolder)) {
      this.type = "test";
    }
  }
}
