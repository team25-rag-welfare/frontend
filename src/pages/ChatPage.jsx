// src/pages/ChatPage.jsx
import React, { useState } from 'react';
import ChatSidebar from '../component/chat/ChatSidebar';
import ChatWindow from '../component/chat/ChatWindow';

export default function ChatPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [user, setUser] = useState({
    nickname: '산모', age: 29, district: '마포구', childCount: 0, hasHouse: false, pregnancyWeeks: 22,
  });

  // 💡 [수정됨] 백엔드 규격(senderType, content)으로 통일!
  const [messages, setMessages] = useState([
    { id: 1, senderType: 'ASSISTANT', content: '안녕하세요! 어떤 복지 혜택을 도와드릴까요?' },
    { id: 2, senderType: 'USER', content: '지금 내가 받을 수 있는 지원금은 뭐가 있을까?' },
    { id: 3, senderType: 'ASSISTANT', content: '산모님이 받을 수 있는 지원금은 여러 종류가 있어요. 대표적인 지원금을 알려드릴게요!' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // 💡 [수정됨] ChatWindow에서 입력한 텍스트(inputText)를 인자로 받습니다.
  const handleSendMessage = async (inputText) => {
    if (!inputText.trim()) return;

    // 1. 내가 친 채팅을 화면에 먼저 띄움
    const userMsg = { id: Date.now(), senderType: 'USER', content: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 💡 [중요] 아까 백엔드에 만든 가짜 필터를 통과하기 위한 더미 토큰 (유저 ID: 1)
      const dummyToken = 'dummy-jwt-token-userid-1-abcd';

      const response = await fetch('http://localhost:8081/api/v1/chats/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${dummyToken}` // 문지기 통과용 출입증!
        },
        body: JSON.stringify({ content: inputText }), // 백엔드 ChatRequestDto 규격
      });

      if (!response.ok) throw new Error('서버 응답 에러');
      const data = await response.json();

      // 3. 백엔드에서 받은 답변을 화면에 띄움
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, senderType: data.senderType || 'ASSISTANT', content: data.answer }
      ]);
    } catch (error) {
      console.error('통신 에러:', error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, senderType: 'ASSISTANT', content: '앗! 서버랑 연결이 끊어졌어요. 낑낑...' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <ChatSidebar isLoggedIn={isLoggedIn} user={user} />
      
      <ChatWindow 
        isLoggedIn={isLoggedIn} 
        user={user} 
        messages={messages} 
        onSendMessage={handleSendMessage} // 💡 자식에게 통신 함수를 물려줌!
        isLoading={isLoading} 
      />
    </div>
  );
}