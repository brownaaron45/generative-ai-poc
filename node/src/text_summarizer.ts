import * as dotenv from "dotenv";
import {Configuration, OpenAIApi} from "openai";

dotenv.config();
const _configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const _openai = new OpenAIApi(_configuration);

export const summarizeText = async (text: string) => {
  const prompt = `Provide a summary of the text: ${text}`;
  const response = await _openai.createCompletion({
    model: "davinci",
    prompt: prompt,
    temperature: 0.3,
    max_tokens: 250,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log(`response: ${response.data}`);

  const summary = response.data.choices[0].text.trim();
  return summary;
};
