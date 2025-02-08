// API configuration
const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Dark/Light Mode Toggle (toggle between dark (default) and light mode)
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', function(e) {
  e.preventDefault();
  document.body.classList.toggle('light');
});

// Chat Functionality with API Integration
const sendButton = document.getElementById('send-button');
const chatInput = document.getElementById('chat-input');
const chatWindow = document.getElementById('chat-window');

// Append a chat message into the chat window
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

// Create a typing indicator for the bot
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

// Define the blink animation using keyframes via JavaScript injection
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = `
  @keyframes blink {
    0%, 80%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

// Send message function: appends the user's message, shows a typing indicator,
// then calls the API and appends the bot's response.
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

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-r1-distill-llama-70b",
        messages: [{ role: "user", content: message }],
        temperature: 0.6,
        max_completion_tokens: 1024,
        reasoning_format: "parsed",
      }),
    });
    const data = await response.json();
    const botReply = data.choices[0].message.content;

    // Remove typing indicator and display bot reply
    if (typingIndicator && typingIndicator.parentNode) {
      chatWindow.removeChild(typingIndicator);
    }
    appendMessage('bot', botReply);
  } catch (error) {
    console.error("Error:", error);
    if (typingIndicator && typingIndicator.parentNode) {
      chatWindow.removeChild(typingIndicator);
    }
    appendMessage('bot', "Error fetching response. Please try again.");
  }
}

// Event listeners for sending messages (button click & Enter key)
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendMessage();
  }
});

// FAQ Accordion Behavior
const faqItems = document.querySelectorAll('.faq-item h3');
faqItems.forEach(item => {
  item.addEventListener('click', function() {
    this.parentElement.classList.toggle('active');
  });
});

// Feedback Form (Demo Submission)
const feedbackForm = document.getElementById('feedback-form');
feedbackForm.addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Thank you for your feedback!');
  feedbackForm.reset();
});
