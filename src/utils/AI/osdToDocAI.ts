import { PromptTemplate } from "@langchain/core/prompts";
import log from "../logger.js";
import model from "./model.js";

async function osdToDocAI(prompts: string): Promise<string> {
  const promptTemplate = new PromptTemplate({
    template: `
      # Create documentation from a series of prompts in markdown, like a README.
      ## IMPORTANT:
      - Always respond with markdown, and ensure the documentation has the following structure:
        - Title (project name)
        - Description (what the project is about)
        - Requirements (what language it's made in, Node.js version, etc.)
        - How to Install (steps to install the project)
        - Explain tree folder structure
        - Explain Dependencies (explain the project's dependencies)
        - Explain Code Functionality (explain what the code does)
        - How to Use (steps to use the project)
        - Usage Examples

      ## Document format:
      - Do not enclose the entire document as a markdown code block.
      - When explaining in a list, do not use markdown lists. Instead, use numbered titles (e.g., "1. First Step", "2. Second Step").
      - Use the same language throughout the document.

      prompts: {prompts}
      
      `,
    inputVariables: ["prompts"],
  });

  const chain = promptTemplate.pipe(model());

  const response = await chain.invoke({
    prompts: JSON.stringify(prompts),
  });

  log.debug(`osd To Doc --> ${prompts}`);
  log.debug(`osd To Doc <-- ${response?.content as string}`);
  return response?.content as string;
}

export default osdToDocAI;
