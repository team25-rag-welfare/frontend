// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSidebar from '../component/chat/ChatSidebar';
import ChatWindow from '../component/chat/ChatWindow';
import axios from 'axios';
import Onboarding from '../component/Onboarding';
import ConditionEdit from '../component/ConditionEdit';

export default function ChatPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  //임시용
  const [user, setUser] = useState({
    nickname: '산모', age: 29, district: '마포구', childCount: 0, hasHouse: false, pregnancyWeeks: 22,
  });


  const [messages, setMessages] = useState([]);
    
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConditionEdit, setShowConditionEdit] = useState(false);

  //화면이 켜지자마자 과거채팅 불러오기
  useEffect(() => {
    const token = localStorage.getItem('access_token');

    //토큰 없으면 로그인창으로 이동
    if(!token){
      alert("로그인을 해주시기 바랍니다.");
      navigate('/login');
      return;
    }

    //이전 대화록 가져오기 (GET)
    const fetchHistory = async () => {
      try{
        const response = await fetch('http://localhost:8081/api/v1/chats/messages', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 403) throw new Error('토큰 만료');
        if (!response.ok) throw new Error('서버 에러');

        const data = await response.json();
        setMessages(data); // 백엔드에서 준 과거 대화로 화면 채우기!
      } catch (error) {
        console.log("채팅내역 불러오기 실패: " + error);
        if (error.messages === '토큰 만료'){
          alert("로그인이 만료되었습니다. 다시 로그인 하십시오.");
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      }
    };

    fetchHistory();
    // 온보딩 여부 확인
    if (token) {
      axios.get('http://localhost:8081/api/v1/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        const { district, pregnancyStatus, userAge, childCount } = response.data;
        // 필수 정보 하나라도 없으면 온보딩 띄우기
        if (!district || !pregnancyStatus || !userAge || !childCount) {
          setShowOnboarding(true);
        }
      }).catch(() => {
        // 비회원이거나 에러나면 온보딩 띄우기
        setShowOnboarding(true);
      });
    }
  }, [navigate]);



  //ChatWindow에서 입력한 텍스트(inputText)를 인자로 받습니다.
  const handleSendMessage = async (inputText) => {
    if (!inputText.trim()) return;

    // 1. 내가 친 채팅을 화면에 먼저 띄움
    const userMsg = { id: Date.now(), senderType: 'USER', content: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('access_token');;

      //axios.post('주소', {바디데이터}, {헤더설정}) 순서
      //왜 위에는 fetch이고 밑에는 axios라고 묻는다면 다양한 방법으로 한번 해보고 샆었습니다.
      const response = await axios.post('http://localhost:8081/api/v1/chats/messages', 
        { content: inputText }, // 바디 (보낼 데이터)
        { 
          headers: { 'Authorization': `Bearer ${token}` } // 헤더 (신분증)
        }
      );

      const data = response.data;  

      //백엔드에서 받은 답변을 화면에 띄움
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, senderType: data.senderType || 'ASSISTANT', content: data.answer }
      ]);
    } catch (error) {
      console.error('통신 에러:', error);

      if (error.response && error.response.status === 403){
        alert("로그인이 만료되었습니다");
        navigate('/login');
        return;
      }
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, senderType: 'ASSISTANT', content: '앗! 서버랑 연결이 끊어졌어요.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('진짜로 로그아웃 하시겠습니까?')){
      localStorage.removeItem('access_token');
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <ChatSidebar 
      isLoggedIn={isLoggedIn} 
      user={user} 
      onLogout={handleLogout} 
      onEditCondition={() => setShowConditionEdit(true)} />
      
      <ChatWindow 
        isLoggedIn={isLoggedIn} 
        user={user} 
        messages={messages} 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        showOnboarding={showOnboarding}
        onOnboardingComplete={() => setShowOnboarding(false)}
        showConditionEdit={showConditionEdit}
        onConditionEditClose={() => setShowConditionEdit(false)}
      />
    </div>
  );
}