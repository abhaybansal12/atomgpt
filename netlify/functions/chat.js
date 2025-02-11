exports.handler = async (event) => {
  const API_KEY = process.env.GROQ_API_KEY; // Secure API Key from Environment Variables
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";
  try {
    const requestBody = JSON.parse(event.body);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-r1-distill-llama-70b",
        messages: requestBody.messages,
        temperature: 0.6,
        max_completion_tokens: 1024,
        reasoning_format: "parsed",
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch response" }),
    };
  }
};
