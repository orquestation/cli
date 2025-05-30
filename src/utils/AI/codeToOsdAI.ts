import { PromptTemplate } from "@langchain/core/prompts";
import log from "../logger.js";
import model from "./model.js";

async function ask(code: string): Promise<string> {
  const promptTemplate = new PromptTemplate({
    template: `
    # Create an explanation of the source code I'm providing below.
    IMPORTANT:
    - Only return the explanation, without any introduction, embellishment, or summary.
    - The explanation should be detailed enough to serve as a prompt to recreate the exact same source code.
    # source code: {code}
    `,
    inputVariables: ["code"],
  });

  const chain = promptTemplate.pipe(model());

  const response = await chain.invoke({
    code: JSON.stringify(code),
  });

  log.debug(`--> ${code}`);
  log.debug(`<-- ${response?.content as string}`);
  return response?.content as string;
}

export default ask;
