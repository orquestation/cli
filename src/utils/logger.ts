import colors from "colors";

function formatMessage(msg: string | object) {
  if (typeof msg === "object") {
    return JSON.stringify(msg, null, 2);
  }
  return msg;
}

export default class log {
  static error(msg: string | object) {
    console.error(colors.red(formatMessage(msg)));
  }

  static debug(msg: string | object) {
    if (process.env.OSD_DEBUG) console.log(colors.bgWhite(formatMessage(msg)));
  }

  static msg(msg: string | object) {
    console.log(colors.green(formatMessage(msg)));
  }

  static warn(msg: string | object) {
    console.warn(colors.yellow(formatMessage(msg)));
  }
}
