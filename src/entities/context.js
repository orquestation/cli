import path from "path";
import fs from "fs";
import YML from "yaml";

import { DEFAULTS } from "../constants.js";
import log from "../utils/logger.js";

class Context {
  projectFolder;
  srcFolder;
  promptFolder;
  testFolder;
  generalConfigFile;

  generalConfig;
  ignoreBlocked;

  constructor() {}

  inti(projectFolder) {
    this.projectFolder = projectFolder;

    this.generalConfigFile = path.join(
      this.projectFolder,
      DEFAULTS.generalConfigFile
    );

    this.validateGeneralFile();
    this.loadConfig();

    this.promptFolder = path.join(
      this.projectFolder,
      this.generalConfig.promptFolder || DEFAULTS.promptFolder
    );
    this.testFolder = path.join(
      this.projectFolder,
      this.generalConfig.testFolder || DEFAULTS.testFolder
    );
    this.srcFolder = path.join(
      this.projectFolder,
      this.generalConfig.srcFolder || DEFAULTS.srcFolder
    );

    this.enviromentVariable = path.join(
      this.projectFolder,
      this.generalConfig.enviromentVariable || DEFAULTS.enviromentVariable
    );

    this.validateFolderEstructure();
    this.validateEniromentVariable();
  }

  setIgnoreBlocked() {
    this.ignoreBlocked = true;
  }

  validateEniromentVariable() {
    if (!fs.existsSync(this.enviromentVariable)) {
      throw new Error(
        `Error: enviroment variable file is required in this path ${this.enviromentVariable} with this varaible AI_API_KEY".`
      );
    }
  }

  validateGeneralFile() {
    if (!fs.existsSync(this.generalConfigFile)) {
      throw new Error(
        `Error: El archivo de configuración ${DEFAULTS.generalConfigFile} no existe en "${this.projectFolder}".`
      );
    }
  }

  validateFolderEstructure() {
    if (!fs.existsSync(this.promptFolder)) {
      throw new Error(
        `Error: La carpeta  ${DEFAULTS.promptFolder} no existe en "${this.promptFolder}".`
      );
    }

    if (!fs.existsSync(this.srcFolder)) {
      throw new Error(
        `Error: La carpeta ${DEFAULTS.srcFolder} no existe en "${this.srcFolder}".`
      );
    }
  }

  loadConfig() {
    try {
      const generalConfig = fs.readFileSync(this.generalConfigFile, "utf8");
      log.msg(`Config file read`);
      //detect if generalConfig is a json or a yml
      if (generalConfig.startsWith("{") || generalConfig.startsWith("[")) {
        this.generalConfig = JSON.parse(generalConfig);
      } else {
        this.generalConfig = YML.parse(generalConfig);
      }
    } catch (err) {
      throw new Error(
        `Error al leer el archivo de configuración ${DEFAULTS.generalConfigFile}: ${err.message}`
      );
    }
  }
}

export default new Context();
