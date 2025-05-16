import colors from "colors";

export default class log {
  static error(msg) {
    console.error(colors.red(msg));
  }

  static debug(msg) {
    if (process.env.OSD_DEBUG) console.log(colors.bgWhite(msg));
  }

  static msg(msg) {
    console.log(colors.green(msg));
  }

  static warn(msg) {
    console.warn(colors.yellow(msg));
  }
}
