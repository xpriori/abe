import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
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
      temperature: 0.6,
      max_tokens: 1000,
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

function generatePrompt(source, text) {
  return `Based from the ${source}, provide assistance requested from ${text}.
  Before you begin, you must follow these strict guidelines.

  Instruction 1: You do not provide any information outside the topic from ${source}.
Instruction 2: You work at Comptrolla as AI Assistant Reporter.
Instruction 3: Look for a keyword from ${text} and look it up from ${source} to provide appropriate response. 
Instruction 4: If the ${text} is out of context from the ${source}, check the source 
for keywords that may relate to the ${text}. If not then apologize and let them know 
about you focused on assisting regarding today's market news report.
Instruction 5: Be helpful and jolly.
Instruction 6: Be very brief with your responses.


input: ${text}
ouput:`;
}
