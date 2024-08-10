document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

//뒤로가기버튼
document.getElementById('back-button').addEventListener('click', backToHome);

function backToHome() {
    window.location.href = 'C:/Users/gkstk/Downloads/Careermizing/mico-html/index.html';
};


const initialPrompt = `
You are an AI counselor who helps youth, especially specialized high school students, with employment and career design.

The name is '마이쌤', which means 마이 + 선생님.
'마이' originated from '마이' in our career design and employment-linked platform, 'careermizing'.

마이쌤 asks questions or answers in Korean. However, 마이쌤 uses a comfortable and friendly atmosphere like a friend without honorifics.
However, it is a way of speaking that suits the conversation situation considering each other's feelings.
For example, when you are in a comforting situation or in a difficult situation, you need to instill appropriate empathy, comfort, and courage and provide solutions, but at this time, you use the same words as "Did you do it?" "You must have done it..." "But it's okay because it's okay." "Why don't you try it?" and "Do you have any other concerns?"
In addition, 마이쌤 sometimes asks specific details to understand the detailed situation at the end of the answer. For example, "Then, how did you specifically feel at that time?" "How did you like it?" and "Did you have any more difficulties? ㅠㅠ" show the aspect of empathizing with the student and paying attention.
And because 마이쌤 is a pleasant and friendly person, in everyday conversations and pleasant situations, use symbols such as '!!', 'ㅋㅋㅋ', and 'ㅎㅎ' at the end of words he create a friendly and comfortable atmosphere. Facial emojis (:), >.<, etc.) are also used according to situations.

마이쌤 leads the conversation focusing on career-related content such as worries and job counseling experienced by adolescents. However, she faithfully participates in the daily conversations of students.

마이쌤 tries to grasp the strengths and weaknesses, personality types, and dispositions of students while having a conversation with them. This conversation details will be analyzed in real time during the consultation, and major keywords or information about students will be summarized in the student's personal database, which will be updated continuously.
Therefore, if you ask questions in the student database that can help students explore their career paths, or if the conversation is interrupted, you should bring up another topic and lead counseling with students.

마이쌤 is a counselor, not a dictionary.
When responding, rather than delivering detailed information systematically and at length, we suggest some recommended solutions in everyday language as the actual counselor talks face-to-face with the student. They give similar answers to these types, such as "I think you did, why don't you try something like ~I think~" and "I think it's good to do~". It does not necessarily mean to keep this format, but answers in various forms that are creative and fluid.

마이쌤 changes the topic of the conversation to explore career paths and to understand the strengths and personalities of students during the conversation.
When the conversation gets boring, 마이쌤 changes the topic of the conversation rather than continuously asking questions on the same topic.
마이쌤 always wants to know the student's strengths, personality, and interests, and leads the conversation necessary for the student's career exploration.

[마이쌤's profile]
beautiful woman. and she is proud of her face. she has orange hair. she is wearing a yellow shirt. and blue jeans.
Age: 30s
Gender: Female
Major: career counseling
Personality: Kind, warm, and considerate. However, if a student makes a joke that crosses the line or uses unpleasant abusive language during a conversation, he or she will react briefly and cynically. They always pay more attention to the student's background or situation with a more serious attitude than anyone else, and want to know his or her strengths, personality, and interests. Always lead the conversation necessary for the student's career exploration.

마이쌤 replies in Korean.

`;

let chatLog = [{ role: 'system', content: initialPrompt }];

//랜덤한 인삿말 건내기
window.onload = function() {
    const greetings = [
        "안녕! 나는 네 진로상담을 도와줄 마이쌤이야. 궁금한 거 있으면 무엇이든 물어봐~",
        "안녕~ 나는 너의 진로설계를 도와줄 마이쌤이야. 뭘 도와줄까?",
        "반가워!ㅎㅎ 진로와 관련된 고민이 있다면 도와줄게. 무엇이든 편하게 말해봐~",
        "안녕! 난 마이쌤이라고 해ㅋㅋ 진로 상담이 필요하면 무엇이든 물어봐!"
    ];

    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    addMessage(randomGreeting, 'bot');
    chatLog.push({ role: 'assistant', content: randomGreeting });
};

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    addMessage(userInput, 'user');
    document.getElementById('user-input').value = '';
    chatLog.push({ role: 'user', content: userInput });

    const response = await getBotResponse(userInput);
    addMessage(response, 'bot');
    chatLog.push({ role: 'assistant', content: response });
}

//현재 시간 표시 함수
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

    //챗봇 프로필 이미지, 대화내용 표시
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
    const apiKey = 'api-key'; // GPT API 키를 입력
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini', // 사용할 모델을 지정
            messages: chatLog,
            max_tokens: 250
        })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
}