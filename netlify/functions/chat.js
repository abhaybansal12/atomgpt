exports.handler = async (event) => {
  console.log("🔹 Function triggered");

  const API_KEY = process.env.GROQ_API_KEY;
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";

  if (!API_KEY) {
    console.error("🚨 ERROR: API Key is missing in environment variables!");
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // ✅ Fix CORS
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: "Server error: API Key is missing." }),
    };
  }

  // Handle Preflight OPTIONS request (CORS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // ✅ Allow requests from all origins
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  try {
    console.log("📨 Raw Request Body:", event.body);

    let requestBody;
    try {
      requestBody = event.body ? JSON.parse(event.body) : null;
    } catch (err) {
      console.error("🚨 ERROR: Failed to parse JSON:", err.message);
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Invalid JSON format" }),
      };
    }

    if (!requestBody || !requestBody.messages || !Array.isArray(requestBody.messages)) {
      console.error("🚨 ERROR: Invalid request format");
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Invalid request: 'messages' must be an array." }),
      };
    }

    console.log("✅ Request body validated:", requestBody);

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

    console.log("📩 API Response:", response.status, response.statusText);

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "API request failed" }),
      };
    }

    const data = await response.json();
    console.log("✅ API Response Data:", data);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("🚨 ERROR:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Failed to fetch response", details: error.message }),
    };
  }
};
