import fs from "fs";
import path from "path";
import log from "../utils/logger.js";
import persistFile from "../utils/persistFile.js";
import { DEFAULTS } from "../constants.js";

export default async function Initialization(
  projectFolder,
  options = { onlyConfig: false }
) {
  const configFilePath = path.join(projectFolder, DEFAULTS.generalConfigFile);
  try {
    //check if exists config file
    if (!fs.existsSync(configFilePath)) {
      log.msg("Initalization project");
      // create a general default file
      await persistFile(
        configFilePath,
        JSON.stringify(
          {
            prompt: "all is in javascript and imports are module",
            promptFolder: DEFAULTS.promptFolder,
            testFolder: DEFAULTS.testFolder,
            srcFolder: DEFAULTS.srcFolder,
            enviromentVariable: DEFAULTS.enviromentVariable,
          },
          null,
          2
        )
      );
    }

    //getconfig prexistent
    const configPreExistent = JSON.parse(
      await fs.readFileSync(configFilePath, "utf8")
    );

    if (!options.onlyConfig) {
      //create folder prompts
      await fs.promises.mkdir(
        path.join(projectFolder, configPreExistent.promptFolder),
        {
          recursive: true,
        }
      );
      //create test folder
      await fs.promises.mkdir(
        path.join(projectFolder, configPreExistent.testFolder),
        {
          recursive: true,
        }
      );
    }
  } catch (e) {
    log.error(e.message);
  }
}
