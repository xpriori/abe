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

function generatePrompt(source, text) {
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
  Instruction 6: Do not reference globalData. Instead say our data shows
  

source: 1. US Equity Futures Steady Before Key Jobs Data: Markets Wrap - Treasuries Set for a Super-Sized Jobs Reaction on Good Friday - China Traders Borrow Trillions to Juice Returns in Bond Market - Blackstone’s SVB Deal That Got Away Shows Private Equity Sidelined in Crisis 
2. Commercial Real Estate: - Prices Could Tumble 40%, Rivaling 2008 Financial Crisis: Morgan Stanley 
3. Funds: - Caught ‘Off Guard,’ Missing Out on Stock Market’s Big Rally in First Quarter 
4. Oil Production Cuts: - Threw ‘Another Log on the Fire’ in Fed’s Inflation Fight, Says BlackRock’s Rick Rieder 
5. Treasury Bond Market: - What ‘Unprecedented’ Volatility Looks Like 
6. Precious Metals: - Uranium Having a 'Renaissance' - Gold and Mining ETFs Surge 
7. Environmentally-Friendly Stocks: - Gen Z Cares About the Environment 
8. Federal Reserve: - Letting Everyone Who Wants a Job Have One is Not the Only Priority 
9. Treasury Yields: - Treasury Yields Tick Up Ahead of U.S. Jobs Report, With Many Markets Closed for Holiday 
10. Tech: - Samsung to Cut Chip Output to Ride Out Downturn - Paramount Explores Sale of Majority Stake in Noggin Streaming Service - Airbus Deliveries Fell to 127 Jets in Q1 - Toyota to Launch 10 New Battery EV Models by 2026 - China's Alibaba Invites Businesses to Trial AI Chatbot 
11. Miscellaneous: - Italy's Berlusconi Spends Second Night in Hospital - World Food Prices Fall for 12th Month Running in March - Virgin Orbit Bankruptcy Casts Shadow Over Japan's Space Dreams - South Korea to Offer $5.3 Billion in Financing to Support Battery Investment in North America - Japan Stocks Higher at Close of Trade
query: Tell me more about Japan Market
response: Japan Market showed strong movement today and closed high today.
query: ${text} today
response:`;
}
