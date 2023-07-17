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
          "short summary based on the text. The following text snippets are " +
          "taken from pdf's after they have been parsed so their may be some " +
          "irregularities with order. Limit your summary to 500 characters.",
      },
      {
        role: "user",
        content: text,
      },
    ],
    max_tokens: 128,
  });

  let summary = chatCompletion.data.choices[0].message?.content;

  if (summary === undefined || summary.length === 0) {
    return "Summary Unavailable.";
  }

  const sentences = summary.split(RegExp("(?<=[.!?])\\s+"));
  summary = "";
  let length = 0;
  for (const sentence of sentences) {
    if (length + sentence.length > 500) break;
    summary += sentence + " ";
    length = summary.length;
  }
  summary = summary.trim();
  return summary;
};
