document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// 뒤로가기 버튼
document.getElementById('reset-button').addEventListener('click', reset());

function reset() {
    document.getElementById('chat-box').innerHTML = '';
    addMessage(randomGreeting, 'bot');
    threadId = '';
};

const initialPrompt = `
You are an AI counselor who helps youth, especially specialized high school students, with employment and career design.
...
`;

const assistantId = 'asst_zPmQZN4VXSkwmcBV7IiO8CEU'; // 실제 어시스턴트 ID로 교체
let threadId = ''; // 스레드 ID를 초기화

// 랜덤한 인삿말 건네기
window.onload = function() {
    const greetings = [
        "안녕! 나는 네 진로상담을 도와줄 마이쌤이야. 궁금한 거 있으면 무엇이든 물어봐~",
        "안녕~ 나는 너의 진로설계를 도와줄 마이쌤이야. 뭘 도와줄까?",
        "반가워!ㅎㅎ 진로와 관련된 고민이 있다면 도와줄게. 무엇이든 편하게 말해봐~",
        "안녕! 난 마이쌤이라고 해ㅋㅋ 진로 상담이 필요하면 무엇이든 물어봐!"
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    addMessage(randomGreeting, 'bot');
};

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return; // 입력값이 공백이면 실행 x

    addMessage(userInput, 'user');
    document.getElementById('user-input').value = '';

    const response = await getBotResponse(userInput);
    addMessage(response, 'bot');
}

// 현재 시간 표시 함수
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0을 12로 변경
    return `${ampm} ${hours}:${minutes}`;
}

function addMessage(message, type) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.classList.add(type === 'user' ? 'user-message' : 'bot-message');

    // 챗봇 프로필 이미지, 대화내용 표시
    const profilePicUrl = type === 'bot' ? 'img/그림3.png' : '';
    const currentTime = getCurrentTime();
    messageElement.innerHTML = `
        ${type === 'bot' ? `<img src="${profilePicUrl}" alt="${type} profile" class="profile-pic">` : ''}
        <div class="message-bubble">
            ${message}
        </div>
        <div class="message-time ${type === 'bot' ? 'bot-time' : 'user-time'}">${currentTime}</div>
    `;

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function getBotResponse(userInput) {
    const response = await fetch('https://careermizing.herokuapp.com/api/send-message', { // Heroku 서버로 요청
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            assistantId: assistantId,
            userInput: userInput,
            threadId: threadId
        })
    });

    const data = await response.json();
    threadId = data.thread_id; // 새로운 스레드 ID 업데이트  
    return data.choices[0].message.content.trim();
}
