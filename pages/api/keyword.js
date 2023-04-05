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

  const summary = req.body.text || "";
  if (summary.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid article",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(summary),
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

function generatePrompt(text) {
  return `Get important key words

raw: Local Bond Market: The yield of the benchmark 5-year bond advanced by 1 basis point (bp) and closed at 5.94%.
output: Bond,  Market, advanced, 1,  bp, closed, 5.94%
raw: Philippine Stocks: The Philippine Stock Exchange Index (PSEi) continued to climb on Thursday due to strong gains in tech, easing
concerns about the banking sector, and positive economic data. Foreign funds were net buyers with inflows of
Php 0.56 million. The PSEi gained 13.78 points or 21 bps and closed at 6,644.75.
output: Philippines, stocks, climb, strong, tech, easing, banking, positive, inflows, PSEi, gained, 13.78, 21, bps, closed, 6,644.75 
raw: ${text}
ouput:`;
}
