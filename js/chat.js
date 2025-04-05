// Chat Page JavaScript

// DOM Elements
const contactListEl = document.getElementById('contactList');
const chatMessagesEl = document.getElementById('chatMessages');
const messageInputEl = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const newChatBtn = document.getElementById('newChatBtn');
const startChatBtn = document.getElementById('startChatBtn');
const chatContactNameEl = document.getElementById('chatContactName');
const chatContactStatusEl = document.getElementById('chatContactStatus');
const newChatModal = new bootstrap.Modal(document.getElementById('newChatModal'));

// Chat Data
const contacts = [
    {
        id: 1,
        name: 'Dr. John Doe',
        role: 'Family Doctor',
        initials: 'JD',
        avatarColor: 'bg-primary',
        status: 'online'
    },
    {
        id: 2,
        name: 'Lisa Chen',
        role: 'Nutritionist',
        initials: 'LC',
        avatarColor: 'bg-success',
        status: 'offline'
    },
    {
        id: 3,
        name: 'Health Chatbot',
        role: 'AI Assistant',
        initials: 'HC',
        avatarColor: 'bg-info',
        status: 'online'
    },
    {
        id: 4,
        name: 'Dr. Robert Johnson',
        role: 'Cardiologist',
        initials: 'RJ',
        avatarColor: 'bg-warning',
        status: 'away'
    },
    {
        id: 5,
        name: 'Dr. Sarah Williams',
        role: 'Therapist',
        initials: 'SW',
        avatarColor: 'bg-danger',
        status: 'offline'
    }
];

// Message data (would be stored in a database in a real app)
const conversations = {
    1: [
        {
            sender: 'contact',
            content: 'Hello! How are you feeling today?',
            time: '10:30 AM'
        },
        {
            sender: 'user',
            content: 'Hi Dr. Doe, I\'m feeling much better today. The medication seems to be working.',
            time: '10:32 AM'
        },
        {
            sender: 'contact',
            content: 'That\'s great news! Any side effects I should know about?',
            time: '10:35 AM'
        },
        {
            sender: 'user',
            content: 'Just a little dizziness in the morning, but it goes away quickly.',
            time: '10:36 AM'
        }
    ],
    2: [
        {
            sender: 'contact',
            content: 'Good afternoon! How is your diet plan going?',
            time: '02:15 PM'
        },
        {
            sender: 'user',
            content: 'It\'s going well, but I\'m having trouble with the afternoon snacks.',
            time: '02:20 PM'
        },
        {
            sender: 'contact',
            content: 'Let\'s adjust that. Try having a handful of nuts or Greek yogurt instead.',
            time: '02:22 PM'
        }
    ],
    3: [
        {
            sender: 'contact',
            content: 'Hello! I\'m your Health Assistant. How can I help you today?',
            time: '11:00 AM'
        },
        {
            sender: 'user',
            content: 'Can you remind me what the normal blood pressure range is?',
            time: '11:01 AM'
        },
        {
            sender: 'contact',
            content: 'Normal blood pressure is considered to be below 120/80 mmHg. Anything between 120/80 and 139/89 is considered prehypertension, and 140/90 or above is considered hypertension.',
            time: '11:02 AM'
        }
    ],
    4: [
        {
            sender: 'contact',
            content: 'How have you been monitoring your heart rate during exercise?',
            time: '09:45 AM'
        },
        {
            sender: 'user',
            content: 'I\'ve been using the app you recommended. My resting heart rate is around 68 bpm.',
            time: '09:50 AM'
        }
    ],
    5: []
};

// Current chat state
let currentContact = 1;

// Initialize Chat Page
function initializeChat() {
    loadChat(currentContact);
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Send message on button click
    sendMessageBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key press
    messageInputEl.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Contact item click
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const contactId = parseInt(this.getAttribute('data-contact-id'));
            switchChat(contactId);
        });
    });
    
    // New Chat button
    newChatBtn.addEventListener('click', function() {
        newChatModal.show();
    });
    
    // Start Chat button
    startChatBtn.addEventListener('click', function() {
        const selectedContactId = parseInt(document.getElementById('newChatContactSelect').value);
        const initialMessage = document.getElementById('newChatMessage').value;
        
        switchChat(selectedContactId);
        
        if (initialMessage.trim() !== '') {
            // Add the initial message to the conversation
            const timestamp = formatTime(new Date());
            
            conversations[selectedContactId].push({
                sender: 'user',
                content: initialMessage,
                time: timestamp
            });
            
            // Save conversations to storage
            saveConversationsToStorage();
            
            // Load the chat with the new message
            loadChat(selectedContactId);
            
            // Simulate a response for demo purposes
            setTimeout(() => {
                simulateResponse(selectedContactId);
            }, 1000);
        }
        
        newChatModal.hide();
    });
}

// Load Chat Conversation
function loadChat(contactId) {
    // Update current contact
    currentContact = contactId;
    
    // Update active contact in the list
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.getAttribute('data-contact-id')) === contactId) {
            item.classList.add('active');
        }
    });
    
    // Find the contact
    const contact = contacts.find(c => c.id === contactId);
    
    // Update chat header
    chatContactNameEl.textContent = contact.name;
    chatContactStatusEl.textContent = capitalizeFirstLetter(contact.status);
    
    // Update the avatar in chat header
    const headerAvatar = document.querySelector('.card-header .contact-avatar');
    headerAvatar.className = `contact-avatar ${contact.avatarColor}`;
    headerAvatar.textContent = contact.initials;
    
    // Clear chat messages
    chatMessagesEl.innerHTML = '';
    
    // Load conversation
    if (conversations[contactId] && conversations[contactId].length > 0) {
        conversations[contactId].forEach(message => {
            addMessageToChat(message);
        });
    } else {
        // If no conversation yet, add a placeholder
        const placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'text-center text-muted p-4';
        placeholderDiv.textContent = 'No messages yet. Start a conversation!';
        chatMessagesEl.appendChild(placeholderDiv);
    }
    
    // Scroll to bottom of chat
    scrollToBottom();
}

// Switch Chat
function switchChat(contactId) {
    if (contactId !== currentContact) {
        loadChat(contactId);
    }
}

// Send Message
function sendMessage() {
    const messageContent = messageInputEl.value.trim();
    
    if (messageContent === '') {
        return;
    }
    
    // Create timestamp
    const timestamp = formatTime(new Date());
    
    // Create message object
    const message = {
        sender: 'user',
        content: messageContent,
        time: timestamp
    };
    
    // Add message to conversation
    if (!conversations[currentContact]) {
        conversations[currentContact] = [];
    }
    
    conversations[currentContact].push(message);
    
    // Save conversations to storage
    saveConversationsToStorage();
    
    // Add message to chat display
    addMessageToChat(message);
    
    // Clear input
    messageInputEl.value = '';
    
    // Scroll to bottom
    scrollToBottom();
    
    // If chatting with the AI bot, simulate a response
    if (currentContact === 3) {
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message message-received typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        chatMessagesEl.appendChild(typingIndicator);
        scrollToBottom();
        
        // Simulate AI response after delay
        setTimeout(() => {
            // Remove typing indicator
            typingIndicator.remove();
            
            // Generate AI response
            simulateAIResponse(messageContent);
        }, 1500);
    } else {
        // For other contacts, simulate a simple response after delay
        setTimeout(() => {
            simulateResponse(currentContact);
        }, 2000);
    }
}

// Simulate Response
function simulateResponse(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    
    if (contact.status === 'offline') {
        return; // No response if contact is offline
    }
    
    // Create timestamp
    const timestamp = formatTime(new Date());
    
    // Simple canned responses
    let responseContent = '';
    
    switch (contactId) {
        case 1: // Doctor
            responseContent = "I'll note that down. Keep monitoring your symptoms and let me know if anything changes.";
            break;
        case 2: // Nutritionist
            responseContent = "That sounds good. Remember to stay hydrated throughout the day too!";
            break;
        case 3: // AI Bot
            // Handled by the simulateAIResponse function
            return;
        case 4: // Cardiologist
            responseContent = "Let's discuss this more at your next appointment. Continue with your prescribed exercise routine.";
            break;
        case 5: // Therapist
            responseContent = "Thank you for sharing that with me. How does that make you feel?";
            break;
        default:
            responseContent = "Thanks for your message. I'll get back to you soon.";
    }
    
    // Create message object
    const message = {
        sender: 'contact',
        content: responseContent,
        time: timestamp
    };
    
    // Add message to conversation
    if (!conversations[contactId]) {
        conversations[contactId] = [];
    }
    
    conversations[contactId].push(message);
    
    // Save conversations to storage
    saveConversationsToStorage();
    
    // If this is the current chat, add the message to the display
    if (contactId === currentContact) {
        addMessageToChat(message);
        scrollToBottom();
    }
}

// Simulate AI Chatbot Response
function simulateAIResponse(userMessage) {
    const timestamp = formatTime(new Date());
    let responseContent = '';
    
    // Simple pattern matching for demo purposes
    userMessage = userMessage.toLowerCase();
    
    if (userMessage.includes('hello') || userMessage.includes('hi')) {
        responseContent = 'Hello! How can I assist you with your health today?';
    } else if (userMessage.includes('blood pressure')) {
        responseContent = "Normal blood pressure is below 120/80 mmHg. If you're concerned about your blood pressure, remember to measure it consistently at the same time of day.";
    } else if (userMessage.includes('medication') || userMessage.includes('pill')) {
        responseContent = "It's important to take your medications as prescribed. Would you like me to set up a reminder for you?";
    } else if (userMessage.includes('exercise') || userMessage.includes('workout')) {
        responseContent = 'Regular exercise is great for your health! The recommended amount is at least 150 minutes of moderate activity per week.';
    } else if (userMessage.includes('diet') || userMessage.includes('food') || userMessage.includes('eat')) {
        responseContent = 'A balanced diet is essential for good health. Try to include plenty of fruits, vegetables, whole grains, and lean proteins.';
    } else if (userMessage.includes('sleep')) {
        responseContent = 'Adults should aim for 7-9 hours of quality sleep per night. Maintaining a consistent sleep schedule can help improve your sleep quality.';
    } else if (userMessage.includes('stress') || userMessage.includes('anxiety')) {
        responseContent = 'Stress management is important for your overall well-being. Have you tried techniques like deep breathing, meditation, or physical activity to help manage stress?';
    } else if (userMessage.includes('thank')) {
        responseContent = "You're welcome! Is there anything else I can help you with?";
    } else {
        responseContent = "I understand you've shared some health information with me. Would you like specific advice on this topic or would you prefer to speak with a healthcare professional?";
    }
    
    // Create message object
    const message = {
        sender: 'contact',
        content: responseContent,
        time: timestamp
    };
    
    // Add message to conversation
    conversations[currentContact].push(message);
    
    // Save conversations to storage
    saveConversationsToStorage();
    
    // Add message to chat display
    addMessageToChat(message);
    
    // Scroll to bottom
    scrollToBottom();
}

// Add Message to Chat
function addMessageToChat(message) {
    const messageDiv = document.createElement('div');
    
    if (message.sender === 'user') {
        messageDiv.className = 'message message-sent';
    } else {
        messageDiv.className = 'message message-received';
    }
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${message.content}
        </div>
        <div class="message-time">${message.time}</div>
    `;
    
    chatMessagesEl.appendChild(messageDiv);
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// Storage Functions
function loadConversationsFromStorage() {
    const storedConversations = localStorage.getItem('chat_conversations');
    
    if (storedConversations) {
        return JSON.parse(storedConversations);
    }
    
    return conversations;
}

function saveConversationsToStorage() {
    localStorage.setItem('chat_conversations', JSON.stringify(conversations));
}

// Utility Functions
function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${formattedMinutes} ${ampm}`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Initialize page when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load conversations from storage
    const storedConversations = loadConversationsFromStorage();
    
    if (storedConversations) {
        Object.assign(conversations, storedConversations);
    }
    
    initializeChat();
}); 