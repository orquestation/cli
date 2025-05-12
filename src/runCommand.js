import { exec } from "node:child_process";
import color from "colors";

export default async function runCommand(projectPath, externals) {
  console.log(color.green("INSTALLING", externals));
  for await (const runComand of externals) {
    const { error } = await exec(`cd ${projectPath} &&  ${runComand}`);

    if (error) console.error(Color.red(`Installing has a error: ${error}`));
  }
}
