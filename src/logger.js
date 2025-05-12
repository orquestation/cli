import colors from "colors";

export default function log(message, level) {
  switch (level) {
    case "error":
      console.error(colors.red(message));
      break;
    case "debug":
      console.log(message);
      break;
    case "msg":
      console.log(colors.green(message));
      break;
    case "warn":
      console.warn(colors.yellow(message));
      break;
    default:
      console.log(message);
      break;
  }
}
