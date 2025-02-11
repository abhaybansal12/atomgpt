const API_ENDPOINT = "/.netlify/functions/chat"; // Netlify function endpoint

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  chatInput.value = "";
  chatInput.focus();

  const typingIndicator = createTypingIndicator();
  chatWindow.appendChild(typingIndicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    if (typingIndicator.parentNode) {
      chatWindow.removeChild(typingIndicator);
    }
    appendMessage("bot", data.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
    if (typingIndicator.parentNode) {
      chatWindow.removeChild(typingIndicator);
    }
    appendMessage("bot", "Error fetching response. Please try again.");
  }
}
