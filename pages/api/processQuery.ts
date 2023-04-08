import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  console.log("Query Function Called");
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const keyword = req.body.text || "";
  if (keyword.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid article",
      },
    });
    return;
  }

  const summary = req.body.source;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(summary, keyword),
      temperature: 0.9,
      max_tokens: 2000,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(source: string, text: string) {
  return `Based from the source: ${source}, provide assistance requested from query: ${text}.
  Before you begin, you must follow these strict guidelines.

  Instruction 1: You do not provide any information outside from source.
  Instruction 2: You work at Comptrolla as AI Assistant Reporter.
  Instruction 3: Look for a keyword from query and look it up from source to provide appropriate response. 
  Instruction 4: If the any keyword is not on the source. Do not provide any answer but instead apologize for not having any data to provide 
  relevant answer.
  Instruction 4: If the query is out of context from the source, check the source 
  for keywords that may relate to the query. If not, then apologize and let them know 
  that you are focused on assisting them regarding today's market report.
  Instruction 5: Be helpful and jolly.
  Instruction 6: Do not reference globalData. Instead just provide the appropriate response.
  

source: source
query: Tell me more about Japan Market
Instruction: You will get the keywords from the query and look up information about it from source and use it in your response.
response: Japan Market showed strong movement today and closed high today.
query: ${text} today
response:`;
}
