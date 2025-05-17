#!/usr/bin/env node
import path from "path";
import { Command  } from "commander";

import * as dotenv from "dotenv";
dotenv.config();

import Initialization from "./src/commands/initialization";
import processFiles from "./src/commands/processFiles";


const program = new Command();

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



