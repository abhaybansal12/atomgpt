const API_ENDPOINT = "https://atomgpt.netlify.app/.netlify/functions/chat";

// Dark/Light Mode Toggle
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', function(e) {
  e.preventDefault();
  document.body.classList.toggle('light');
});

// Chat Elements
const sendButton = document.getElementById('send-button');
const chatInput = document.getElementById('chat-input');
const chatWindow = document.getElementById('chat-window');

// Append messages to chat window
function appendMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('chat-message', sender);
  const bubble = document.createElement('div');
  bubble.classList.add('bubble');
  bubble.textContent = text;
  messageDiv.appendChild(bubble);
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Create a typing indicator
function createTypingIndicator() {
  const container = document.createElement('div');
  container.classList.add('chat-message', 'bot');
  const indicator = document.createElement('div');
  indicator.classList.add('bubble');
  indicator.style.display = 'flex';
  indicator.style.gap = '4px';

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.style.width = '6px';
    dot.style.height = '6px';
    dot.style.backgroundColor = '#ccc';
    dot.style.borderRadius = '50%';
    dot.style.animation = 'blink 1.4s infinite both';
    dot.style.animationDelay = `${i * 0.2}s`;
    indicator.appendChild(dot);
  }

  container.appendChild(indicator);
  return container;
}

// Define keyframes for blinking dots
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes blink {
    0%, 80%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

// Send message function
async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  // Append user message and clear input
  appendMessage('user', message);
  chatInput.value = '';
  chatInput.focus();

  // Show typing indicator
  const typingIndicator = createTypingIndicator();
  chatWindow.appendChild(typingIndicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;

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

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    // Remove typing indicator and display bot reply
    if (typingIndicator.parentNode) {
      chatWindow.removeChild(typingIndicator);
    }
    appendMessage('bot', botReply);
  } catch (error) {
    console.error("🚨 API Request Failed:", error);
    if (typingIndicator.parentNode) {
      chatWindow.removeChild(typingIndicator);
    }
    appendMessage('bot', "Error fetching response. Please try again.");
  }
}

// Event listeners for sending messages
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// FAQ Accordion Behavior
document.querySelectorAll('.faq-item h3').forEach(item => {
  item.addEventListener('click', function() {
    this.parentElement.classList.toggle('active');
  });
});

// Feedback Form
document.getElementById('feedback-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Thank you for your feedback!');
  this.reset();
});
