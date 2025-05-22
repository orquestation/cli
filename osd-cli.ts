#!/usr/bin/env node
import path from "path";
import { Command  } from "commander";

import * as dotenv from "dotenv";
dotenv.config();

import Initialization from "./src/commands/initialization.js";
import processFiles from "./src/commands/processFiles.js";
import srcToOsd from "./src/commands/srcToOsd.js";

const program = new Command();

program
  .option("-p, --path <path>", "obsolute path to root project")
  .option("-i, --init", "create those necesary folders")
  .option("-o, --onlyConfig", "Create only config file")
  .option("-a, --ignoreBlocked", "ignore osd blocked and process all the files")
  .option("-s, --srcToOsd", "get you src files and transform them to osd files");
 

program.parse(process.argv);


// init project, create all necesarie folders and files
if(program.opts().init) {
  const currentDir = program.opts().path
    ? path.resolve(program.opts().path)
    : process.cwd();
  Initialization(currentDir, {onlyConfig: program.opts().onlyConfig});
}


if(program.opts().srcToOsd) {
  srcToOsd(program.opts().path);
}


// main process, process all files
if(!program.opts().init && !program.opts().srcToOsd){
  await processFiles(program.opts().path, program.opts().ignoreBlocked);
}

