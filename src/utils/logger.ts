import colors from "colors";

export default class log {
  static error(msg: string) {
    console.error(colors.red(msg));
  }

  static debug(msg: string) {
    if (process.env.OSD_DEBUG) console.log(colors.bgWhite(msg));
  }

  static msg(msg: string) {
    console.log(colors.green(msg));
  }

  static warn(msg: string) {
    console.warn(colors.yellow(msg));
  }
}
