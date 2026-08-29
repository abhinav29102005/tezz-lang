require('dotenv').config();
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage } = require('@langchain/core/messages');

/**
 * askGemini
 * Zero-config wrapper for Google's Gemini models via LangChain.
 * Automatically looks for GOOGLE_API_KEY in the environment.
 * 
 * @param {string} prompt - The question or prompt for the LLM.
 * @param {string} model - The model name (default: gemini-1.5-flash)
 * @returns {Promise<string>} The string response from the LLM.
 */
async function askGemini(prompt, model = 'gemini-1.5-flash') {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error('tezz-llm: GOOGLE_API_KEY environment variable is missing.');
  }
  
  const llm = new ChatGoogleGenerativeAI({
    modelName: model,
    maxOutputTokens: 2048,
  });

  const response = await llm.invoke([
    new HumanMessage(prompt)
  ]);
  
  return response.content;
}

/**
 * askOpenAI
 * Zero-config wrapper for OpenAI's GPT models via LangChain.
 * Automatically looks for OPENAI_API_KEY in the environment.
 * 
 * @param {string} prompt - The question or prompt for the LLM.
 * @param {string} model - The model name (default: gpt-3.5-turbo)
 * @returns {Promise<string>} The string response from the LLM.
 */
async function askOpenAI(prompt, model = 'gpt-3.5-turbo') {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('tezz-llm: OPENAI_API_KEY environment variable is missing.');
  }
  
  const llm = new ChatOpenAI({
    modelName: model,
    temperature: 0.7,
  });

  const response = await llm.invoke([
    new HumanMessage(prompt)
  ]);
  
  return response.content;
}

module.exports = {
  askGemini,
  askOpenAI
};
