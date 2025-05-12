import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { DEFAULTS } from "./constants.js";

async function ask(prompt, configContent) {
  // Initialize the Gemini Pro model
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env[DEFAULTS.AI_API_KEY],
    temperature: 0,
  });

  const promptTemplate = new PromptTemplate({
    template: `
    # create code and unity test for {prompt}.
    ## IMPORTANT:
    - return always a json with 2 properties code and test (ex.: {{"code":code, "test":unity test code}})
    - the code is only for this file, not add code of any other file
    - only return a json without any other decorations
    
    # if file import a external module add another property called externals to json with a array of intallation code
    
    IMPORTANT: {basePrompt}`,
    inputVariables: ["prompt", "basePrompt"],
  });
  const chain = promptTemplate.pipe(model);

  const response = await chain.invoke({
    prompt: JSON.stringify(prompt),
    basePrompt: configContent.prompt,
  });
  return response?.content;
}

export default ask;
