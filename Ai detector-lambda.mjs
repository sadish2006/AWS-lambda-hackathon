import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
  console.log(" Event Received:", JSON.stringify(event));

  let body;
  try {
    body = event.body ? JSON.parse(event.body) : event;
  } catch (err) {
    console.error(" Failed to parse body:", err);
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Invalid request body." }),
    };
  }

  const inputText = body?.text?.trim();
  if (!inputText) {
    console.log(" No input text received.");
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Text input is required." }),
    };
  }

  try {
    const wordCount = inputText.split(/\s+/).filter(Boolean).length;

    const claudePrompt = `
Analyze the following text and return only JSON (no explanation). Format:

{
  "aiGeneratedProbability": number,
  "humanProbability": number,
  "confidence": "Low" | "Medium" | "High",
  "patterns": [{"type": string, "confidence": "Low" | "Medium" | "High"}]
}

Text:
"""${inputText}"""
`;

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [{ role: "user", content: claudePrompt }],
        max_tokens: 600,
        temperature: 0.2,
      }),
    });

    const response = await client.send(command);
    const rawBody = await response.body.transformToString();
    console.log(" Raw Claude Response:", rawBody);

    const parsed = JSON.parse(rawBody);

    const textBlock = parsed?.content?.[0]?.text;
    if (!textBlock) throw new Error("Claude response missing 'content[0].text'");

    const content = JSON.parse(textBlock);

    const result = {
      aiGeneratedProbability: Math.round(content.aiGeneratedProbability * 100),
      humanProbability: Math.round(content.humanProbability * 100),
      confidence: content.confidence,
      patterns: content.patterns,
      wordsAnalyzed: wordCount,
    };

    console.log(" Final AI Detection Result:", JSON.stringify(result, null, 2));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result,null,2),
    };
  } catch (err) {
    console.error(" Bedrock error:", err);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
