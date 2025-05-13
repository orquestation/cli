#!/usr/bin/env node
import path from "path";
import { program } from "commander";

import * as dotenv from "dotenv";
dotenv.config();

import folderHandler from "./src/folderHandler.js";
import Context from "./src/context.js";
import Initialization from "./src/initialization.js";
import log from "./src/logger.js";

async function processFiles(pathProject) {
  const currentDir = pathProject ? path.resolve(pathProject) : process.cwd();

  try {
    Context.inti(currentDir);
    folderHandler();
  } catch (e) {
    log(e.message, "error");
  }
}

program
  .option("-p, --path <path>", "obsolute path to root project")
  .option("-i, --init", "create those necesary folders")
  .option("-o, --onlyConfig", "Create only config file")
  .action((option) => {
    if (option.init) {
      const currentDir = option.path
        ? path.resolve(option.path)
        : process.cwd();
      Initialization(currentDir, option);

      return;
    }
    processFiles(option.path);
  });

program.parse(process.argv);
