// src/components/chat/ChatSidebar.jsx
import React from 'react';

export default function ChatSidebar({ isLoggedIn, user }) {
  // 데이터가 없을 때를 대비한 기본값(null 처리)
  const displayUser = user || {
    nickname: '사용자', age: null, district: '미입력', childCount: null, hasHouse: null, pregnancyWeeks: null
  };

  return (
    <div className="w-[400px] bg-[#FFF0F2] flex flex-col p-8 shadow-xl z-10 shrink-0 border-r border-pink-100">
      
      {/* 로고 영역 */}
      <div className="mb-10">
        <h1 className="text-5xl font-extrabold text-[#FF9E9E] mb-2 tracking-tight">산책</h1>
        <p className="text-sm font-medium text-gray-400">산모를 위한 복지 체크</p>
      </div>

      {/* 검색 바 */}
      <div className="mb-8">
        <div className="relative">
          <input 
            type="text" 
            placeholder="내가 대화한 기록 찾기" 
            className="w-full py-4 px-6 rounded-2xl text-base border-none shadow-inner bg-white/60 focus:bg-white outline-none transition-all"
          />
          <span className="absolute right-5 top-4 text-xl">🔍</span>
        </div>
      </div>

      {/* 필터 (날짜) */}
      <div className="mb-8">
        <p className="text-sm font-bold text-gray-500 mb-2 ml-1">날짜</p>
        <div className="bg-white/80 py-3 px-5 rounded-xl text-lg text-gray-600 shadow-sm flex justify-between items-center cursor-pointer">
          <span>Value</span>
          <span className="text-xs text-gray-400">▼</span>
        </div>
      </div>

      {/* 프로필 섹션 */}
      <div className="flex items-center space-x-4 mb-8 p-2">
        <div className="w-14 h-14 bg-gray-200 rounded-2xl shadow-inner flex items-center justify-center text-2xl">👤</div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Title</h3>
          <p className="text-sm text-gray-400">Description</p>
        </div>
      </div>

      {/* 🌟 피그마 핵심: 내 조건 카드 */}
      <div className="bg-white rounded-[30px] p-8 shadow-lg border border-pink-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-800">내 조건</h2>
          <button className="text-sm font-bold text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100 hover:bg-gray-100 transition-all">
            수정 →
          </button>
        </div>
        
        {/* 상세 목록 */}
        <div className="space-y-5 mb-8">
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <span className="text-lg text-gray-400">만 나이</span>
            <span className="text-lg font-bold text-gray-700">{displayUser.age ?? 'null'}세</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <span className="text-lg text-gray-400">자녀 수</span>
            <span className="text-lg font-bold text-gray-700">{displayUser.childCount ?? 'null'}명</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <span className="text-lg text-gray-400">주택 소유</span>
            <span className="text-lg font-bold text-[#FF8585]">{displayUser.hasHouse === null ? 'null' : (displayUser.hasHouse ? '보유' : '무주택')}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-gray-50">
            <span className="text-lg text-gray-400">소득 구간</span>
            <span className="text-lg font-bold text-gray-700">미입력</span>
          </div>
          <div className="flex justify-between items-center pb-2">
            <span className="text-lg text-gray-400">수급 여부</span>
            <span className="text-lg font-bold text-gray-700">해당 없음</span>
          </div>
        </div>

        {/* 하단 태그 (Pills) */}
        <div className="flex flex-wrap gap-2">
          <span className="bg-[#FFF0F2] text-[#FF8585] px-4 py-2 rounded-full text-sm font-bold border border-[#FFE0E5]">임신 중</span>
          <span className="bg-gray-50 text-gray-500 px-4 py-2 rounded-full text-sm font-bold border border-gray-200">{displayUser.pregnancyWeeks ?? 'null'}주차</span>
          <span className="bg-[#E6F4EA] text-[#34A853] px-4 py-2 rounded-full text-sm font-bold border border-[#CEEAD6]">{displayUser.district ?? 'null'}</span>
          <span className="bg-gray-50 text-gray-500 px-4 py-2 rounded-full text-sm font-bold border border-gray-200">29세</span>
        </div>
      </div>

      {/* 로그아웃 버튼 (하단 고정) */}
      <div className="mt-auto pt-6 border-t border-pink-200 flex justify-between items-center">
        <button className="bg-[#FF9E9E] text-white text-lg font-black py-4 px-10 rounded-2xl shadow-lg hover:bg-[#FF8585] transition-all transform active:scale-95">
          로그아웃
        </button>
        <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm hover:shadow-md transition-all text-gray-300">
          ⚙️
        </button>
      </div>
    </div>
  );
}