import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const model = anthropic("claude-sonnet-4-6");

export const answerMyQuestion = async (
  prompt: string,
) => {
  const result = await generateText({
    model,
    prompt,
  });

  console.log(result)

  return result.text;
};

(async () => {
  const answer = await answerMyQuestion(
    "what is the chemical formula for dihydrogen monoxide?",
  );

  console.log(answer);
})();
