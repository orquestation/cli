import { PromptTemplate } from "@langchain/core/prompts";
import log from "../logger.js";
import { Tconfig } from "../../types/Tconfig.js";
import model from "./model.js";

async function osdToCodeAI(
  prompt: string,
  configContent: Tconfig,
  test: boolean
): Promise<string> {
  let promptTemplate;
  if (test) {
    promptTemplate = new PromptTemplate({
      template: `
      # create code and unity test for {prompt}.
      ## IMPORTANT:
      - return always a json with 2 properties code and test (ex.: {{"code":code, "test":unity test code}})
      - the code is only for this file, not add code of any other file
      - only return a json without any other decorations
      - the code must be escaped in such a way that it does not produce errors in the JSON.
      
      # if file import a external module add another property called externals to json with a array of intallation code
      
      IMPORTANT: {basePrompt}`,
      inputVariables: ["prompt", "basePrompt"],
    });
  } else {
    promptTemplate = new PromptTemplate({
      template: `
      # create code for {prompt}.
      ## IMPORTANT:
      - return always a json with 2 properties code (ex.: {"code":code,})
      - the code is only for this file, not add code of any other file
      - only return a json without any other decorations
      - the code must be escaped in such a way that it does not produce errors in the JSON.
      
      # if file import a external module add another property called externals to json with a array of intallation code
      
      IMPORTANT: {basePrompt}`,
      inputVariables: ["prompt", "basePrompt"],
    });
  }

  const chain = promptTemplate.pipe(model());

  const response = await chain.invoke({
    prompt: JSON.stringify(prompt),
    basePrompt: configContent.prompt,
  });

  log.debug(`osd To Code --> ${prompt}`);
  log.debug(`osd To Code <-- ${response?.content as string}`);
  return response?.content as string;
}

export default osdToCodeAI;
