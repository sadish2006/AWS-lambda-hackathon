import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime"; 

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" }); 

// Humanization Logic
const humanizeWithBedrock = async (text) => {
  const body = {
    anthropic_version: "bedrock-2023-05-31",
    messages: [
      {
        role: "user",
        content: `Rewrite the following text to be:
 Human-like, neutral, and formal.
 Maintain its original meaning and approximate length.
 Do NOT add commentary, labels, or extraneous text.
 Return only the rewritten text.

Original Text:
${text}`
      }
    ],
    max_tokens: 256,
    temperature: 0.3,
    top_p: 0.9,
  };
  
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  });
  
  const response = await bedrockClient.send(command);
  const rawResponse = new TextDecoder("utf-8").decode(response.body);
  const responseBody = JSON.parse(rawResponse);

  console.log("Bedrock rawResponse:", JSON.stringify(responseBody, null, 2));

  if (responseBody?.content?.[0]?.text) {
    return responseBody.content[0].text.trim();
  } else {
    console.error("Bedrock returned unexpected structure:", responseBody);
    return ""; 
  }
};

//  Improved Human Score
const calculateHumanScore = (text) => {
  const words = text.trim().split(/\s+/);
  const uniqueWords = new Set(words);
  const longWords = words.filter((w) => w.length > 6).length;

  const longWordRatio = longWords / words.length;
  const uniqueWordRatio = uniqueWords.size / words.length;

  // Simple measure for variety:
  // Long words, unique words, and slightly adjust for variety
  const combinedRatio = (longWordRatio * 0.5) + (uniqueWordRatio * 0.5);
  const rawScore = combinedRatio * 100;

  return Math.round(Math.min(100, Math.max(30, rawScore)));
};


//  Improved Readability Score (Flesch Reading Ease)
const calculateReadability = (text) => {
  const words = text.trim().split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const syllables = text.split(/\s+/).reduce((count, word) => {
    return count + ((word.toLowerCase().match(/[aeiouy]+/g) || []).length);
  }, 0);

  const ASL = words / sentences;
  const ASW = syllables / words;

  const fleschReadingEase = 206.835 - (1.015 * ASL) - (84.6 * ASW);
  // Constrain between 30–100
  return Math.round(Math.min(100, Math.max(30, fleschReadingEase)));
};


export const handler = async (event) => {
  try {
    let text;

    if (event?.body) {
      const body = JSON.parse(event.body);
      text = body.text;
    } else if (event?.text) {
      text = event.text;
    }

    if (!text) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Missing 'text' in request" }),
      };
    }

    // Get Humanized Text
    const humanized = await humanizeWithBedrock(text);
    if (!humanized) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Bedrock returned no humanized text" }),
      };
    }

    //  Get Scores
    const humanScore = calculateHumanScore(humanized);
    const readabilityScore = calculateReadability(humanized);

    //  Log Everything to CloudWatch
    console.log("Original Text:", text);
    console.log("Humanized Text:", humanized);
    console.log("Human Score:", humanScore);
    console.log("Readability Score:", readabilityScore);

    // Final Response
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        originalText: text,
        humanizedText: humanized,
        humanScore,
        readabilityScore,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: error.message || "Internal Server Error" }),
    };
  }
};
