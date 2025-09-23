const gun = GUN([
    'http://192.168.178.21:3000/gun',
    'https://gun-manhattan.herokuapp.com/gun',
    'https://gun-us.herokuapp.com/gun'
]);

const chat = gun.get('general-chat');
document.getElementById('send-btn').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    const message = {
        text: input.value,
        user: 'John doe',
        timestamp: Date.now(),
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2,9)
    };
    chat.get('messages').get(message.id).put(message);
    input.value = '';
});
let isInitialLoad = true;



chat.get('messages').map().once((message, key) => {
    if(message) {displayMessage(message);}});
setTimeout(()=>{
    isInitialLoad = false;
    chat.get('messages').map().on((message, key)=> {
        if(message && !isInitialLoad && !document.getElementById(message.id)) {
            displayMessage(message);
        }
    })
}, 100);

function displayMessage(message) {
    const messageDiv = document.getElementById('messages');
    const messageEl = document.createElement('div');
    messageEl.id = message.id;
    messageEl.innerHTML = 
        `<strong>${message.user}:</strong> ${message.text}
    <small>${ new Date(message.timestamp).toLocaleDateString()}</small>`;
    messageDiv.appendChild(messageEl);
    messageDiv.scrollTop = messageDiv.scrollHeight;
};
