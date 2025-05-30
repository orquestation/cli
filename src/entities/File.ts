import Context from "./Context.js";
import path from "node:path";
import fs from "node:fs";
import YML from "yaml";
import { TcontentFilePrompt } from "../types/TcontentFilePrompt.js";
import persistFile from "../utils/persistFile.js";

export interface IBaseFile {
  name: string;
  parentPath: string;
  absolutePath: string;
}

export interface IOriginalFile extends IBaseFile {
  type: "prompt" | "src" | "test" | "unknown";
}

export interface IFile {
  original: IOriginalFile;

  src: IBaseFile;
  prompt: IBaseFile;
  test: IBaseFile;

  readme: IBaseFile;

  content: TcontentFilePrompt;
  rawContent: string;
  direction: "osd-code" | "code-osd";

  loadContent: () => Promise<void>;
  parseContent: () => Promise<void>;
  persistSrcFile: (code: string) => Promise<void>;
  persistTestFile: (test: string) => Promise<void>;
  persistOsdFile: (prompt: string) => Promise<void>;

  detectType: () => void;
}

export default class File implements IFile {
  original: IOriginalFile = {
    name: "",
    parentPath: "",
    absolutePath: "",
    type: "unknown",
  };

  src: IBaseFile = { name: "", parentPath: "", absolutePath: "" };
  prompt: IBaseFile = { name: "", parentPath: "", absolutePath: "" };
  test: IBaseFile = { name: "", parentPath: "", absolutePath: "" };

  readme: IBaseFile = { name: "", parentPath: "", absolutePath: "" };

  rawContent: string = "";
  content: TcontentFilePrompt = { prompt: "" };
  promptFilePath: string = "";
  type: "prompt" | "src" | "test" | "unknown" = "unknown";
  direction: "osd-code" | "code-osd" = "osd-code";

  constructor(file: { name: string; parentPath: string }) {
    this.original.name = file.name;
    this.original.parentPath = file.parentPath;
    this.original.absolutePath = path.join(file.parentPath, file.name);
    this.detectType();

    this.readme.name = Context.readme;
    this.readme.parentPath = Context.projectFolder;
    this.readme.absolutePath = path.join(Context.projectFolder, Context.readme);

    if (this.original.type === "prompt") {
      this.prompt.name = file.name;
      this.prompt.parentPath = file.parentPath;
      this.prompt.absolutePath = path.join(file.parentPath, file.name);
    } else {
      this.prompt.name = `${this.original.name}${Context.extensionPrompt}`;
      this.prompt.parentPath = Context.promptFolder;
      this.prompt.absolutePath = path.join(
        Context.promptFolder,
        this.prompt.name
      );
    }

    if (this.type === "src") {
      this.src.name = this.original.name;
      this.src.parentPath = this.original.parentPath;
      this.src.absolutePath = path.join(
        this.original.parentPath,
        this.original.name
      );
    } else {
      this.src.name = path.parse(this.original.name).name;
      this.src.parentPath = Context.srcFolder;

      this.src.absolutePath = path.join(Context.srcFolder, this.src.name);
    }

    this.test.name = path.parse(this.original.name).name;
    this.test.parentPath = Context.testFolder;
    this.test.absolutePath = path.join(Context.testFolder, this.test.name);
  }

  async loadContent() {
    const fileContent = await fs.readFileSync(
      this.original.absolutePath,
      "utf8"
    );
    this.rawContent = fileContent;
  }

  async parseContent() {
    if (this.rawContent.startsWith("{") || this.rawContent.startsWith("[")) {
      this.content = await JSON.parse(this.rawContent);
    } else {
      this.content = await YML.parse(this.rawContent);
    }

    this.direction = this.content?.direction || "osd-code";
  }

  async persistOsdFile(prompt: string) {
    const objectToPersist = YML.stringify({ prompt, direction: "code-osd" });
    try {
      await persistFile(this.prompt.absolutePath, objectToPersist);
    } catch (e: unknown) {
      throw new Error(
        `Error writing prompt file "${this.prompt.absolutePath}": ${
          (e as Error).message
        }`
      );
    }
  }

  async persistSrcFile(code: string) {
    try {
      await persistFile(this.src.absolutePath, code);
    } catch (e: unknown) {
      throw new Error(
        `Error writing src file "${this.src.absolutePath}": ${
          (e as Error).message
        }`
      );
    }
  }

  async persistTestFile(test: string) {
    try {
      await persistFile(this.test.absolutePath, test);
    } catch (e: unknown) {
      throw new Error(
        `Error writing test file "${this.test.absolutePath}": ${
          (e as Error).message
        }`
      );
    }
  }

  async persistDocFile(content: string) {
    try {
      await persistFile(this.readme.absolutePath, content);
    } catch (e: unknown) {
      throw new Error(
        `Error writing doc file "${this.readme.absolutePath}": ${
          (e as Error).message
        }`
      );
    }
  }

  detectType() {
    if (this.original.parentPath.includes(Context.promptFolder)) {
      this.original.type = "prompt";
    } else if (this.original.parentPath.includes(Context.srcFolder)) {
      this.original.type = "src";
    } else if (this.original.parentPath.includes(Context.testFolder)) {
      this.original.type = "test";
    }
  }
}
