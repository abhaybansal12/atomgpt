exports.handler = async (event) => {
  console.log("Function triggered");

  const API_KEY = process.env.GROQ_API_KEY;
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";

  if (!API_KEY) {
    console.error("🚨 ERROR: API Key is missing in environment variables!");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error: API Key is missing." }),
    };
  }

  try {
    console.log("Received request:", event.body);
    
    if (!event.body) {
      throw new Error("Request body is empty");
    }

    const requestBody = JSON.parse(event.body);

    if (!requestBody.messages || !Array.isArray(requestBody.messages)) {
      throw new Error("Invalid request format. 'messages' should be an array.");
    }

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

    if (!response.ok) {
      console.error("🚨 API Call Failed! Status:", response.status, response.statusText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "API request failed" }),
      };
    }

    const data = await response.json();
    console.log("✅ API Response:", data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("🚨 ERROR:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch response", details: error.message }),
    };
  }
};
