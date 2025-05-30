import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DEFAULTS } from "../../constants.js";

export default function model() {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env[DEFAULTS.AI_API_KEY],
    temperature: 0,
  });

  return model;
}
