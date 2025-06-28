import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
  console.log(" Event Received");

  let body;
  try {
    body = event.body ? JSON.parse(event.body) : event;
  } catch (err) {
    console.error(" Failed to parse request body:", err);
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid request body." }),
    };
  }

  const inputText = body?.text?.trim();
  if (!inputText) {
    console.log(" No input text received.");
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Text input is required." }),
    };
  }

  try {
    const claudePrompt = `
    You are an expert plagiarism detection engine trained to simulate the behavior of research-level plagiarism tools.

Your task is to deeply analyze the given academic or research-style content and estimate the likelihood that this text is plagiarized or copied from existing published research papers, internet articles, academic theses, or AI-generated examples.

Consider:
- Common textbook phrases or frequently reused descriptions
- Lack of originality or generic wording
- Structure or flow that matches known academic templates
- The presence of jargon without unique phrasing
- AI-generated linguistic patterns (predictable tone, grammar, or filler content)

Based on these factors, provide a plagiarism estimation report in this strict JSON format:

{
  "plagiarismPercentage": number
}
Do not include any other text or explanation.

Now analyze this content:
"""${inputText}"""
`;

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        messages: [{ role: "user", content: claudePrompt }],
        max_tokens: 800,
        temperature: 0.2,
      }),
    });

    const response = await client.send(command);
    const rawBody = await response.body.transformToString();
    const parsed = JSON.parse(rawBody);
    const contentStr = parsed.content?.[0]?.text || "{}";
    const detectionResult = JSON.parse(contentStr);

    // Log the plagiarism percentage
    console.log(" Plagiarism %:", detectionResult.plagiarismPercentage);

    //  Return result to frontend
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plagiarismPercentage: detectionResult.plagiarismPercentage,
      }),
    };
  } catch (err) {
    console.error(" Error during Bedrock processing:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Internal server error." }),
    };
  }
};
