const API_ENDPOINT = "https://atomgpt.netlify.app/.netlify/functions/chat";

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  chatInput.value = "";
  chatInput.focus();

  const requestData = {
    messages: [{ role: "user", content: message }]
  };

  try {
    console.log("🔹 Sending request to:", API_ENDPOINT);
    console.log("📨 Request Data:", JSON.stringify(requestData));

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    console.log("📩 Response received:", response);

    const data = await response.json();
    appendMessage("bot", data.choices[0].message.content);
  } catch (error) {
    console.error("🚨 API Request Failed:", error);
    appendMessage("bot", "Error fetching response. Please try again.");
  }
}
