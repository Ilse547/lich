// Chat application with GUN.js
console.log('🚀 Initializing chat application...');

// Initialize GUN with your Render URL
const gun = GUN({
    peers: [
        'https://lich-z34n.onrender.com/gun',  // Your Render app
        'https://gun-manhattan.herokuapp.com/gun',  // Backup peer 1
        'https://gun-us.herokuapp.com/gun'  // Backup peer 2
    ],
    localStorage: false,
    radisk: false
});

console.log('🔫 GUN initialized with peers:', Object.keys(gun._.opt.peers || {}));

// Chat reference
const chat = gun.get('thatdown-chat');
let username = localStorage.getItem('chatUsername') || '';

// DOM elements
const usernameInput = document.getElementById('username-input') || document.getElementById('username_input');
const setUsernameBtn = document.getElementById('set-username-btn') || document.getElementById('set-UN-btn');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const messagesDiv = document.getElementById('messages');

// Initialize username
function initializeUsername() {
    if (username) {
        console.log('👤 Username loaded:', username);
        if (usernameInput) usernameInput.value = username;
    }
}

// Set username
function setUsername() {
    const newUsername = usernameInput ? usernameInput.value.trim() : '';
    if (newUsername) {
        username = newUsername;
        localStorage.setItem('chatUsername', username);
        console.log('👤 Username set to:', username);
        alert('Username set to: ' + username);
    } else {
        alert('Please enter a username');
    }
}

// Send message
function sendMessage() {
    const messageText = messageInput ? messageInput.value.trim() : '';
    
    if (!messageText) {
        alert('Please enter a message');
        return;
    }
    
    if (!username) {
        alert('Please set your username first');
        if (usernameInput) usernameInput.focus();
        return;
    }
    
    const message = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        text: messageText,
        user: username,
        timestamp: Date.now()
    };
    
    console.log('📤 Sending message:', message);
    
    // Send message to GUN
    chat.get('messages').get(message.id).put(message, (ack) => {
        if (ack.err) {
            console.error('❌ Failed to send message:', ack.err);
            alert('Failed to send message. Please check your connection.');
        } else {
            console.log('✅ Message sent successfully');
            messageInput.value = '';
        }
    });
}

// Display message
function displayMessage(message) {
    if (!messagesDiv || !message || !message.text || !message.user) return;
    
    // Check if message already exists
    if (document.getElementById(message.id)) return;
    
    const messageEl = document.createElement('div');
    messageEl.id = message.id;
    messageEl.className = 'message';
    
    // Add special styling for own messages
    if (message.user === username) {
        messageEl.style.backgroundColor = '#e3f2fd';
        messageEl.style.marginLeft = '20px';
    }
    
    const timeString = new Date(message.timestamp).toLocaleTimeString();
    messageEl.innerHTML = `
        <strong>${escapeHtml(message.user)}:</strong> 
        ${escapeHtml(message.text)}
        <small style="color: #666; margin-left: 10px;">${timeString}</small>
    `;
    
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    console.log('📥 Message displayed:', message.user + ': ' + message.text);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Listen for new messages
let messageCount = 0;
chat.get('messages').map().on((message, key) => {
    if (message && message.text && message.user && message.id) {
        displayMessage(message);
        messageCount++;
        updateConnectionStatus();
    }
});

// Connection status indicator
function updateConnectionStatus() {
    let statusDiv = document.getElementById('connection-status');
    
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'connection-status';
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            z-index: 1000;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        `;
        statusDiv.onclick = () => {
            console.log('🔫 GUN Status:');
            console.log('Peers:', Object.keys(gun._.opt.peers || {}));
            console.log('Messages received:', messageCount);
            console.log('Current user:', username);
        };
        document.body.appendChild(statusDiv);
    }
    
    const peers = gun._.opt.peers || {};
    const activePeers = Object.keys(peers).length;
    
    if (activePeers > 0) {
        statusDiv.textContent = `🟢 Connected (${activePeers} peers, ${messageCount} msgs)`;
        statusDiv.style.backgroundColor = '#4CAF50';
        statusDiv.style.color = 'white';
    } else {
        statusDiv.textContent = '🟡 Connecting...';
        statusDiv.style.backgroundColor = '#FF9800';
        statusDiv.style.color = 'white';
    }
}

// Event listeners
if (setUsernameBtn) {
    setUsernameBtn.addEventListener('click', setUsername);
}

if (usernameInput) {
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') setUsername();
    });
}

if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (messageInput) {
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// GUN event listeners
gun.on('hi', (peer) => {
    console.log('🤝 Connected to peer:', peer);
    updateConnectionStatus();
});

gun.on('bye', (peer) => {
    console.log('👋 Disconnected from peer:', peer);
    updateConnectionStatus();
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM loaded, initializing chat...');
    initializeUsername();
    updateConnectionStatus();
    
    // Send a test message after 3 seconds to verify connection
    setTimeout(() => {
        if (username) {
            console.log('🧪 Sending connection test...');
            const testMsg = {
                id: 'test_' + Date.now(),
                text: '🟢 Connected to chat',
                user: username + ' (test)',
                timestamp: Date.now()
            };
            
            chat.get('messages').get(testMsg.id).put(testMsg, (ack) => {
                if (!ack.err) {
                    console.log('✅ Connection test successful!');
                }
            });
        }
    }, 3000);
});

// Update status every 5 seconds
setInterval(updateConnectionStatus, 5000);

console.log('🎯 Chat application ready!');