export async function* streamComplianceFramework(frameworkName: string, contextData: string) {
  const response = await fetch("https://anthropic.com", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: `Generate a production ready, completely exhaustive ${frameworkName} compliance audit manual for an enterprise with the following setup architecture: ${contextData}`
      }],
      stream: true
    })
  });

  if (!response.body) throw new Error("Failed to process streaming response stream from LLM pipeline");
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    yield chunk;
  }
}
