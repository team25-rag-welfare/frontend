// src/pages/ChatPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatSidebar from '../component/chat/ChatSidebar';
import ChatWindow from '../component/chat/ChatWindow';
import axios from 'axios';
import ConditionEdit from '../component/ConditionEdit';
import SettingsModal from '../component/settings/SettingsModal';
import Toast from '../component/ui/Toast';
import Button from '../component/ui/Button';
import DeleteCalendar from '../component/ui/DeleteCalendar';
import useAuthStore from '../store/authStore';

const getDateKey = (dateStr) => new Date(dateStr).toISOString().slice(0, 10);

const API_URL = import.meta.env.VITE_API_URL;

const RESPONSE_TYPE = {
  POLICY_ANSWER: 'policy_answer',
  CLARIFICATION: 'clarification',
  GUIDE: 'guide',
};

const formatPolicyContent = (text) =>
  text.replace(/ (\d+)\) /g, '\n$1) ');

const isProfileComplete = (profile) => {
  if (!profile) return false;
  if (typeof profile.needsOnboarding === 'boolean') return !profile.needsOnboarding;
  const { district, pregnancyStatus, userAge, childCount } = profile;
  return Boolean(
    district
    && district !== 'NONE'
    && pregnancyStatus
    && pregnancyStatus !== 'NONE'
    && userAge != null
    && childCount != null
  );
};

const buildContent = (data) => {
  if (data.responseType === RESPONSE_TYPE.CLARIFICATION) {
    return (
      data.clarificationQuestion ||
      data.policies?.[0]?.content ||
      '정확한 안내를 위해 필요한 정보를 조금 더 알려주세요.'
    );
  }
  if (!data.policies || data.policies.length === 0) {
    return '관련 정책을 찾지 못했어요.';
  }
  return data.policies.map(p => {
    const isValidName = p.policyName && p.policyName !== 'null' && p.policyName.trim() !== '';
    const body = formatPolicyContent(p.content);
    return isValidName ? `**[${p.policyName}]**\n${body}` : body;
  }).join('\n\n');
};

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin: isLoggedIn, user, accessToken, fetchProfile, logout } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConditionEdit, setShowConditionEdit] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [jumpToDate, setJumpToDate] = useState(null);
  const [searchMatches, setSearchMatches] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loginToast, setLoginToast] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [guestCondition, setGuestCondition] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDateDelete, setShowDateDelete] = useState(false);

  const showLoginToast = () => setLoginToast(true);

  const handleSearch = (ids, keyword) => {
    setSearchMatches(ids);
    setSearchKeyword(keyword);
  };

  const handleClearSearch = () => {
    setSearchMatches([]);
    setSearchKeyword('');
  };

  const refreshProfile = async () => {
    const profile = await fetchProfile();
    setShowOnboarding(profile ? !isProfileComplete(profile) : true);
    return profile;
  };

  const fetchHistory = async (token) => {
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
        logout();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchHistory(accessToken);
      refreshProfile();
    } else {
      setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    if (location.state?.fromTerms) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state]);

  


  const handleSendMessage = async (inputText) => {
    if (!inputText.trim()) return;

    const userMsg = { id: `temp-${Date.now()}`, senderType: 'USER', content: inputText };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let response;

      if (accessToken){
        response = await axios.post(`${API_URL}/api/v2/chats/messages`,
        { content: inputText },
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
      } else{
        const recentChatsForAi = messages.slice(-2).map(msg =>({
          role: msg.senderType === "USER" ? "human" : "assistant",
          content: msg.content
        }));

        response = await axios.post(`${API_URL}/api/v2/chats/guest`, {
          content: inputText,
          chatHistory: recentChatsForAi,
          userCondition: guestCondition,
        });
      }

      const data = response.data;

      let content = buildContent(data);
      if (!isLoggedIn && data.responseType !== RESPONSE_TYPE.CLARIFICATION) {
        content += "\n\n로그인을 하시면 더 확실한 정보를 찾으실 수 있어요 😊";
      }
      setMessages((prev) => [
        ...prev,
        {
          id: data.messageId || `guest-${Date.now()}`,
          senderType: data.senderType || 'ASSISTANT',
          content,
          responseType: data.responseType,
          missingFields: data.missingFields,
        }
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
      if (!accessToken) {
        showLoginToast();
        setIsLoading(false);
        return;
      }
      const response = await axios.post(
        `${API_URL}/api/v2/chats/${chatId}/regenerate`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = response.data;
      const content = buildContent(data);
      setMessages(prev => prev.map(msg => msg.id === chatId ? {
        ...msg,
        content,
        responseType: data.responseType,
        missingFields: data.missingFields,
      } : msg));
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
    try {
      await axios.delete(`${API_URL}/api/v2/chats`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setMessages([]);
    } catch (error) {
     console.error('전체 삭제 실패:', error);
     alert('삭제에 실패했습니다.');
   }
  };

  // 날짜별 대화 삭제
  const handleDeleteByDate = async (date) => {
    try {
      await axios.delete(`${API_URL}/api/v2/chats/date`, {
        params: { targetDate: date },
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setMessages(prev => prev.filter(msg => !msg.createdAt || !msg.createdAt.startsWith(date)));
    } catch (error) {
      console.error('날짜별 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <ChatSidebar
        isLoggedIn={isLoggedIn}
        user={user}
        messages={messages}
        onLogout={handleLogout}
        onEditCondition={() => { if (!isLoggedIn) { showLoginToast(); return; } setShowConditionEdit(true); }}
        onDateSelect={setJumpToDate}
        onSearch={handleSearch}
        onOpenSettings={() => { if (!isLoggedIn) { showLoginToast(); return; } setShowSettings(true); }}
        onShowDeleteAll={() => setShowDeleteAllModal(true)}
        onShowDeleteByDate={() => setShowDateDelete(true)}
      />

      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        onRegenerate={handleRegenerate}
        isLoading={isLoading}
        showOnboarding={showOnboarding}
        onOnboardingComplete={(data) => { setShowOnboarding(false); if (data) setGuestCondition(data); else refreshProfile(); }}
        jumpToDate={jumpToDate}
        searchMatches={searchMatches}
        searchKeyword={searchKeyword}
        onClearSearch={handleClearSearch}
      />

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onProfileUpdate={refreshProfile} />}

      {showConditionEdit && (
        <div className="condition-edit-overlay">
          <ConditionEdit onClose={() => setShowConditionEdit(false)} onSave={refreshProfile} />
        </div>
      )}

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-card logout-modal">
            <div className="logout-modal-icon">👋</div>
            <div>
              <h2>로그아웃 할까요?</h2>
              <p>언제든지 다시 돌아오세요 😊</p>
            </div>
            <div className="logout-modal-btns">
              <Button variant="secondary" size="md" onClick={() => setShowLogoutModal(false)} style={{ flex: 1 }}>취소</Button>
              <Button variant="primary" size="md" onClick={confirmLogout} style={{ flex: 1 }}>로그아웃</Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteAllModal && (
        <div className="modal-overlay">
          <div className="modal-card delete-all-modal">
            <div className="delete-all-modal-icon">🗑️</div>
            <div>
              <h2>전체 대화 삭제</h2>
              <p>
                지금까지의 모든 대화 내용이<br />
                <span className="delete-all-modal-highlight">영구적으로 삭제</span>됩니다.<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="delete-all-modal-btns">
              <Button variant="secondary" size="md" onClick={() => setShowDeleteAllModal(false)} style={{ flex: 1 }}>취소</Button>
              <Button variant="primary" size="md" onClick={() => { setShowDeleteAllModal(false); handleDeleteAll(); }} style={{ flex: 1 }}>삭제</Button>
            </div>
          </div>
        </div>
      )}

      {showDateDelete && (
        <DeleteCalendar
          activeDates={[...new Set(messages.filter(m => m.createdAt).map(m => getDateKey(m.createdAt)))]}
          onConfirm={(date) => { setShowDateDelete(false); handleDeleteByDate(date); }}
          onClose={() => setShowDateDelete(false)}
        />
      )}

      {loginToast && (
        <Toast
          message="로그인이 필요한 기능이에요"
          onLogin={() => { setLoginToast(false); navigate('/login'); }}
          onClose={() => setLoginToast(false)}
        />
      )}
    </div>
  );
}
