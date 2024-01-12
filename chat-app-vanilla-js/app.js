// @ts-nocheck

const ownerSelectorBtn = document.querySelector('#owner-selector');
const visitorSelectorBtn = document.querySelector('#visitor-selector');
const chatHeader = document.querySelector('.chat-header');
const chatMessages = document.querySelector('.chat-messages');
const chatInputForm = document.querySelector('.chat-input-form');
const chatInput = document.querySelector('.chat-input');
const clearChatBtn = document.querySelector('.clear-chat-button');

const messages = JSON.parse(localStorage.getItem('messages')) || [];
let visitorMessageCount = 0;
const visitorMessageLimit = 10;

const explicitWords = ['bitch', 'shit', 'ass','fuck']; // Add your explicit words here

const createChatMessageElement = (message) => `
  <div class="message ${message.sender === 'Owner' ? 'blue-bg' : 'gray-bg'}">
    <div class="message-sender">${message.sender}</div>
    <div class="message-text">${message.text}</div>
    <div class="message-timestamp">${message.timestamp}</div>
  </div>
`;

window.onload = () => {
  messages.forEach((message) => {
    chatMessages.innerHTML += createChatMessageElement(message);
  });
};

let messageSender = 'Owner';

const updateMessageSender = (name) => {
  messageSender = name;
  chatHeader.innerText = `${messageSender} chatting...`;
  chatInput.placeholder = `Type here, ${messageSender}...`;

  if (name === 'Owner') {
    ownerSelectorBtn.classList.add('active-person');
    visitorSelectorBtn.classList.remove('active-person');
  }
  if (name === 'Visitor') {
    visitorSelectorBtn.classList.add('active-person');
    ownerSelectorBtn.classList.remove('active-person');
  }

  /* auto-focus the input field */
  chatInput.focus();
};

ownerSelectorBtn.onclick = () => updateMessageSender('Owner');
visitorSelectorBtn.onclick = () => updateMessageSender('Visitor');

const containsExplicitWord = (text) => {
  const lowerCaseText = text.toLowerCase();
  return explicitWords.some((word) => lowerCaseText.includes(word));
};

const sendMessage = (e) => {
  e.preventDefault();

  if (messageSender === 'Visitor') {
    visitorMessageCount++;
    if (visitorMessageCount > visitorMessageLimit) {
      alert('Visitor can only send 10 messages.');
      return;
    }
  }

  const messageText = chatInput.value;

  if (containsExplicitWord(messageText)) {
    alert('Warning: Your message contains explicit content. Please refrain from using such words.');
    return;
  }

  const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  const message = {
    sender: messageSender,
    text: messageText,
    timestamp,
  };

  /* Save message to local storage */
  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));

  /* Add message to DOM */
  chatMessages.innerHTML += createChatMessageElement(message);

  /* Clear input field */
  chatInputForm.reset();

  /* Scroll to the bottom of chat messages */
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

chatInputForm.addEventListener('submit', sendMessage);

clearChatBtn.addEventListener('click', () => {
  localStorage.clear();
  chatMessages.innerHTML = '';
});
