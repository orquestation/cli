import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { DEFAULTS } from "../constants.js";
import log from "./logger.js";
import { Tconfig } from "../types/Tconfig.js";

async function ask(code: string) : Promise<string> {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env[DEFAULTS.AI_API_KEY],
    temperature: 0,
  });

  let promptTemplate;
 
    promptTemplate = new PromptTemplate({
      template: `
    # Create an explanation of the source code I'm providing below.
    IMPORTANT:
    - Only return the explanation, without any introduction, embellishment, or summary.
    - The explanation should be detailed enough to serve as a prompt to recreate the exact same source code.
    # source code: {code}
    `,
      inputVariables: ["code"],
    });
 

  const chain = promptTemplate.pipe(model);

  const response = await chain.invoke({
    code: JSON.stringify(code),
  });

  log.debug(response?.content as string);
  return response?.content as string;
}

export default ask;
