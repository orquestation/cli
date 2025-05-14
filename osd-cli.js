#!/usr/bin/env node
import path from "path";
import { program } from "commander";

import * as dotenv from "dotenv";
dotenv.config();

import folderHandler from "./src/folderHandler.js";
import Context from "./src/context.js";
import Initialization from "./src/initialization.js";
import log from "./src/logger.js";

async function processFiles(pathProject, ignoreBlocked) {
  const currentDir = pathProject ? path.resolve(pathProject) : process.cwd();

  try {
    Context.inti(currentDir);
    if (ignoreBlocked) Context.setIgnoreBlocked();
    folderHandler();
  } catch (e) {
    log.error(e.message, "error");
  }
}

program
  .option("-p, --path <path>", "obsolute path to root project")
  .option("-i, --init", "create those necesary folders")
  .option("-o, --onlyConfig", "Create only config file")
  .option("-a, --ignoreBlocked", "ignore osd blocked and process all the files")
  .action((option) => {
    if (option.init) {
      const currentDir = option.path
        ? path.resolve(option.path)
        : process.cwd();
      Initialization(currentDir, option);

      return;
    }
    processFiles(option.path, option.ignoreBlocked);
  });

program.parse(process.argv);
