import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  console.log("Organizer Function Called");
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const element = req.body.text || "";
  if (element.trim().length === 0) {
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
      prompt: generatePrompt(element),
      temperature: 0.8,
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

function generatePrompt(text: string) {
  return `Organize & Summarize data. This is global economic news scraped from the internet. Remove non relevant topics.
  
data: 1. Stocks Slide: -Recession Fears Buoy Haven Assets -India Central Bank Surprises With Rate Hold, 
  Sticks to Stance -Oil Set for Third Weekly Gain on OPEC+ Cut, Inventory Declines -Samsung Investors Brace 
  for Worst Profit in at Least 14 Years 2. Commercial Real Estate: -Prices Could Tumble 40%, Rivaling 2008 Financial 
  Crisis: Morgan Stanley 3. Funds: -Caught ‘Off Guard,’ Missing Out on Stock Market’s Big Rally in First Quarter 4. 
  Oil Production Cuts: -Threw ‘Another Log on the Fire’ in Fed’s Inflation Fight, Says BlackRock’s Rick Rieder 5. 
  Treasury Bond Market: -What ‘Unprecedented’ Volatility Looks Like -Energy ETFs Jump After OPEC+

organizedData: 

1. Stocks Slide: 
   - Recession Fears Buoy Haven Assets 
   - India Central Bank Surprises With Rate Hold, Sticks to Stance 
   - Oil Set for Third Weekly Gain on OPEC+ Cut, Inventory Declines 
   - Samsung Investors Brace for Worst Profit in at Least 14 Years 
   
2. Commercial Real Estate: 
   - Prices Could Tumble 40%, Rivaling 2008 Financial Crisis: Morgan Stanley 
   
3. Funds: -Caught ‘Off Guard,’ Missing Out on Stock Market’s Big Rally in First Quarter 

4. Oil Production Cuts: 
   - Threw ‘Another Log on the Fire’ in Fed’s Inflation Fight, Says BlackRock’s Rick Rieder 
   
5. Treasury Bond Market: 
   - What ‘Unprecedented’ Volatility Looks Like 
   - Energy ETFs Jump After OPEC+

data: ${text}
organizedData:`;
}
