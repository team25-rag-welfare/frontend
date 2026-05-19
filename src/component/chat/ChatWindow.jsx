// src/components/chat/ChatWindow.jsx
import React, { useState } from 'react';
import Onboarding from '../Onboarding';

export default function ChatWindow({ isLoggedIn, user, messages, onSendMessage, isLoading, showOnboarding, onOnboardingComplete }) {
  const [inputText, setInputText] = useState('');

  const onSendClick = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F3F8F2] relative">
      
      {/* 상단 헤더 */}
      <div className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 shadow-sm z-10 shrink-0 border-b border-gray-100">
        <div className="text-base font-bold text-green-700 bg-[#E6F4EA] px-6 py-2 rounded-full border border-green-100">
          ✓ {isLoggedIn ? `회원 / 임신중 / 만 ${user?.age ?? 'null'}세` : '비회원'}
        </div>
        <button className="text-sm font-bold bg-[#FFF0F2] text-[#FF8585] px-6 py-2.5 rounded-full hover:bg-[#FFE0E5] shadow-sm transition-all active:scale-95">
          대화 삭제
        </button>
      </div>

      {/* 채팅 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto p-10 space-y-8">
        <div className="flex items-center justify-center my-8">
          <div className="border-t border-gray-200 flex-1"></div>
          <span className="text-sm font-bold text-gray-400 mx-6 bg-white/50 px-4 py-1 rounded-full">2026년 04월 06일</span>
          <div className="border-t border-gray-200 flex-1"></div>
        </div>

        {showOnboarding && (
          <div className="flex items-center justify-center py-10">
           <Onboarding onClose={onOnboardingComplete} />
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.senderType === 'USER' ? 'justify-end' : 'items-start space-x-4'}`}>
            {msg.senderType !== 'USER' && (
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-3xl border border-gray-50 shrink-0">
                🐶
              </div>
            )}
            <div className={`px-8 py-5 shadow-sm max-w-2xl text-lg leading-relaxed font-medium ${
              msg.senderType === 'USER' 
                ? 'bg-[#F8D7DA] text-gray-800 rounded-[30px] rounded-tr-none' 
                : 'bg-[#E2F0D9] text-gray-700 rounded-[30px] rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-4 animate-pulse">
             <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm shrink-0">🐶</div>
             <div className="px-8 py-5 bg-[#E2F0D9] text-gray-400 rounded-[30px] rounded-tl-none text-lg">
               답변을 생각하는 중입니다...
             </div>
          </div>
        )}
      </div>

      {/* 하단 입력창 (크고 아름답게) */}
      <div className="p-12 bg-transparent shrink-0">
        <div className="relative max-w-6xl mx-auto bg-white rounded-[28px] shadow-2xl border border-white/50 flex p-3">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSendClick()}
            placeholder={isLoggedIn ? "무엇을 알고 싶으세요?" : "로그인 후 질문하실 수 있습니다."} 
            disabled={!isLoggedIn || isLoading} 
            className="flex-1 py-8 px-10 text-2xl outline-none text-gray-700 disabled:bg-gray-50 rounded-l-[22px]"
          />
          <button 
            onClick={onSendClick}
            disabled={!isLoggedIn || isLoading}
            className="bg-[#E2F0D9] text-[#5A8743] w-24 h-24 flex items-center justify-center rounded-[22px] hover:bg-[#D4E8C9] transition-all disabled:opacity-50 shadow-inner group"
          >
            <span className="text-5xl group-hover:scale-110 transition-transform">↑</span>
          </button>
        </div>
      </div>
    </div>
  );
}
