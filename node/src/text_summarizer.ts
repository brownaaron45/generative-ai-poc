// src/text_summarizer.ts
import * as dotenv from "dotenv";
import {Configuration, OpenAIApi} from "openai";

dotenv.config();
const _configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const _openai = new OpenAIApi(_configuration);

export const summarizeText = async (text: string) => {
  const chatCompletion = await _openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You jobs is to take the submitted messages of text and generate a " +
          "summary based on the text. The following text snippets are taken " +
          "from pdf's after they have been parsed so their may be some " +
          "irregularities with order.",
      },
      {
        role: "user",
        content: text,
      },
    ],
    max_tokens: 256,
  });

  const summary = chatCompletion.data.choices[0].message?.content;
  console.log(`response: ${summary}`);

  return summary || "Summary Unavailable";
};
