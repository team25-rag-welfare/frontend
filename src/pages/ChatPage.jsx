// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSidebar from '../component/chat/ChatSidebar';
import ChatWindow from '../component/chat/ChatWindow';
import axios from 'axios';
import Onboarding from '../component/Onboarding';
import ConditionEdit from '../component/ConditionEdit';
import SettingsModal from '../component/settings/SettingsModal';

const API_URL = import.meta.env.VITE_API_URL;

export default function ChatPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConditionEdit, setShowConditionEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [jumpToDate, setJumpToDate] = useState(null);
  const [searchMatches, setSearchMatches] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = (ids, keyword) => {
    setSearchMatches(ids);
    setSearchKeyword(keyword);
  };

  const handleClearSearch = () => {
    setSearchMatches([]);
    setSearchKeyword('');
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/v1/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      const { district, pregnancyStatus, userAge, childCount } = response.data;
      if (!district || !pregnancyStatus || userAge == null || childCount == null) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('프로필 조회 실패:', error);
      setShowOnboarding(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('로그인을 해주시기 바랍니다.');
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v2/chats/history`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 403) {
          throw new Error('토큰 만료');
        }

        if (!response.ok) {
          throw new Error('서버 에러');
        }

        const data = await response.json();
        setMessages(data.map((msg, i) => ({ ...msg, id: msg.id ?? `loaded-${i}` })));
      } catch (error) {
        console.log('채팅내역 불러오기 실패:', error);
        if (error.message === '토큰 만료') {
          alert('로그인이 만료되었습니다. 다시 로그인 하십시오.');
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      }
    };

    fetchHistory();
    fetchProfile();
  }, [navigate]);

  const handleSendMessage = async (inputText) => {
    if (!inputText.trim()) return;

    const userMsg = { id: `temp-${Date.now()}`, senderType: 'USER', content: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('access_token');

      const response = await axios.post(`${API_URL}/api/v2/chats/messages`,
        { content: inputText },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      const data = response.data;

      const content = data.policies && data.policies.length > 0
        ? data.policies.map(p => p.policyName ? `[${p.policyName}]\n${p.content}` : p.content).join('\n\n')
        : '관련 정책을 찾지 못했어요.';

      setMessages((prev) => [
        ...prev,
        { id: data.messageId, senderType: data.senderType || 'ASSISTANT', content }
      ]);
    } catch (error) {
      console.error('통신 에러:', error);

      if (error.response && error.response.status === 403) {
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

  const handleRegenerate = async (chatId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `${API_URL}/api/v2/chats/${chatId}/regenerate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      const content = data.policies && data.policies.length > 0
        ? data.policies.map(p => p.policyName ? `[${p.policyName}]\n${p.content}` : p.content).join('\n\n')
        : '관련 정책을 찾지 못했어요.';
      setMessages(prev => prev.map(msg => msg.id === chatId ? { ...msg, content } : msg));
    } catch (error) {
      console.error('재생성 에러:', error);
      if (error.response?.status === 403) {
        alert('로그인이 만료되었습니다');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 전체 대화 삭제
  const handleDeleteAll = async () => {
    if (!window.confirm('전체 대화 내용을 삭제하시겠습니까?')) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/api/v2/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([]);
    } catch (error) {
     console.error('전체 삭제 실패:', error);
     alert('삭제에 실패했습니다.');
   }
  };

  // 날짜별 대화 삭제
  const handleDeleteByDate = async (date) => {
    if (!window.confirm(`${date} 대화 내용을 삭제하시겠습니까?`)) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/api/v2/chats/date`, {
        params: { targetDate: date },
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => prev.filter(msg => !msg.createdAt || !msg.createdAt.startsWith(date)));
    } catch (error) {
      console.error('날짜별 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('진짜로 로그아웃 하시겠습니까?')) {
      localStorage.removeItem('access_token');
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <ChatSidebar isLoggedIn={isLoggedIn} user={user} messages={messages} onLogout={handleLogout} onEditCondition={() => setShowConditionEdit(true)} onDateSelect={setJumpToDate} onSearch={handleSearch} onOpenSettings={() => setShowSettings(true)} />

      <ChatWindow
        isLoggedIn={isLoggedIn}
        user={user}
        messages={messages}
        onSendMessage={handleSendMessage}
        onRegenerate={handleRegenerate}
        isLoading={isLoading}
        showOnboarding={showOnboarding}
        onOnboardingComplete={() => setShowOnboarding(false)}
        jumpToDate={jumpToDate}
        searchMatches={searchMatches}
        searchKeyword={searchKeyword}
        onClearSearch={handleClearSearch}
        onDeleteAll={handleDeleteAll}
        onDeleteByDate={handleDeleteByDate}
      />
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {showConditionEdit && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ConditionEdit onClose={() => setShowConditionEdit(false)} onSave={fetchProfile} />
        </div>
      )}
    </div>
  );
}
