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

  const economic = req.body.economic || "";
  if (economic.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid article",
      },
    });
    return;
  }

  const geopolitics = req.body.geopolitics;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(economic, geopolitics),
      temperature: 0.6,
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

function generatePrompt(eco, geo) {
  return `You are to combine world economic news summary: ${eco} and geopolitics ${geo} to summarize very briefly and 
    come up with a final report that provide insights and market sentiment and effects to the global economic
    output. Be very brief on your summary. At the end, include US Market points such as the Dow Jones, S&P 500 and Nasdaq. 
    Also include commodities prices such as oil, gold, copper, etc.
  `;
}
