// src/components/chat/ChatSidebar.jsx
import React, { use, useState } from 'react';
import axios from 'axios';


export default function ChatSidebar({ isLoggedIn, user, onLogout, onOpenSettings }) {
  // 데이터가 없을 때를 대비한 기본값(null 처리)
  const displayUser = user || {
    nickname: '사용자', age: null, district: '미입력', childCount: null, hasHouse: null, pregnancyWeeks: null
  };

  const [keyword, setKeyword] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showMemory, setShowMemory] = useState(false); // 메모리 창 열림/닫힘 스위치
  const [memories, setMemories] = useState([]); // 백엔드에서 받아온 메모리 목록
  const [showCalender, setShowCalender] = useState(false); //달력 창 열고 닫는 switch
  const [results, setResults] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [selectedMemoryId, setSelectedMemoryId] = useState(null); // 클릭해서 선택한 메모리 ID
  const [isLoadingMemories, setIsLoadingInMemories] = useState(false);

  const handleSearch = async () => {
    if(!keyword.trim()) return;
    setIsSearch(true);

    try{
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8080/api/v1/chats/search?keyword=${keyword}', {
        headers: {'Authorization': 'Bearer ${token}'}
      });

      setResults(response.data);
    } catch (error) {
      console.log('검색 실패: ', error);
      alert('검색중 에러가 발생했습니다.');
    } finally {
      setIsSearch(false);
    }
    
  };

  const handleDateSearch = async () => {
    if (!selectedDate){
      alert('날짜를 선택하세요');
      return;
    }
    setIsSearch(true);
    try{
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8080/api/v1/chats/date', {
        headers: {'Authorization' : 'Bearer ${token}'}
      });
      setResults(response.data);

    } catch (error) {
      console.log('검색 실패: ', error);
      System.error('날짜 검색 실패 ', error);
      alert('날짜 검색에 실패헀습니다.');

    } finally{
      setIsSearch(false);
    }
  }

  const handleFetchMemories = async () => {
    // 이미 열려있는데 또 누르면 닫히게 토글 처리!
    if (showMemory) {
      setShowMemory(false);
      setSelectedMemoryId(null);
      return;
    }

    setIsLoadingInMemories(true);
    setShowMemory(true);

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await axios.get('http://localhost:8080/api/v1/memories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMemories(response.data); // 데이터 구조가{id: 1, content: '내용'}, ... ]
    } catch (error) {
      console.error('메모리 조회 실패:', error);
      alert('메모리를 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingInMemories(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  }

  const handleDeleteMemory = async (memoryId) => {
    if (!window.confirm("이 메모리를 정말 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem('acces_token');
      
      await axios.delete(`http://localhost:8080/api/v1/memories/${memoryId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('성공적으로 삭제되었습니다!');
      
      // 삭제 성공 후 프론트 화면에서도 해당 메모리를 즉시 지워줍니다 (새로고침 방지)
      setMemories((prev) => prev.filter(item => item.id !== memoryId));
      setSelectedMemoryId(null); // 선택 해제
    } catch (error) {
      console.error('메모리 삭제 실패:', error);
      alert('메모리 삭제 중 에러가 발생했습니다.');
    }
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
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="내가 대화한 기록 찾기" 
            className="w-full py-4 px-6 rounded-2xl text-base border-none shadow-inner bg-white/60 focus:bg-white outline-none transition-all"
          />
          <button
            onClick={handleSearch}
            className="absolute right-5 top-4 text-xl cursor-pointer hover:scale-110 transition-transform"
          >
            🔍
          </button>
        </div>
      </div>

      {/* 필터 (날짜) */}
      <div className="mb-8">
        <p className="text-sm font-bold text-gray-500 mb-2 ml-1">날짜별 검색</p>
        {/* 1. 스위치가 꺼져있을 때는 '날짜로 검색' 버튼을 보여줌 */}
        {!showCalender ? (
          <div 
            onClick={() => setShowCalender(true)}
            className='bg-white/80 py-4 px-6 rounded-2xl text-base text-gray-500 shadow-sm flex justify-between items-center cursor-pointer hover:bg-white transition-all'
          >
            <span>📅 날짜로 검색하기</span>
            <span className="text-xs text-gray-400">▼</span>
          </div>
        ) : (
          // 2. 스위치가 켜지면 달력 인풋과 실제 조회 버튼이 등장!
          <div className="bg-white/90 p-4 rounded-2xl shadow-inner border border-pink-50 space-y-3 animate-fadeIn">
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className='w-full bg-white py-3 px-4 rounded-xl text-base text-gray-700 border-none outline-none focus:ring-2 focus:ring-pink-200 transition-all'
            />
            <div className="flex gap-2">
              {/* 진짜 검색을 찌르는 버튼 */}
              <button
                onClick={handleDateSearch}
                className="flex-1 bg-[#FF9E9E] text-white py-2.5 rounded-xl text-sm font-bold hover:bg-[#FF8585] transition-all active:scale-95"
              >
                조회하기 🔍
              </button>
              {/* 닫기 버튼 */}
              <button
                onClick={() => {setShowCalender(false); setSelectedDate(''); }}
                className='bg-gray-100 text-gray-500 py-2.5 px-4 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all'
              >
                취소
              </button>
            </div>
          </div>
        )}
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

      <div className="mt-6">
        {/* Memory 조회하기 버튼 */}
        <button 
          onClick={handleFetchMemories}
          className="w-full bg-white text-gray-700 py-4 px-6 rounded-2xl text-base font-bold shadow-sm border border-pink-100 hover:bg-pink-50/50 transition-all flex justify-between items-center"
        >
          <span>🧠 사용자 메모리 조회하기</span>
          <span className="text-xs text-gray-400">{showMemory ? '▲' : '▼'}</span>
        </button>

        {/* 버튼을 눌러 showMemory가 true가 되면 리스트가 쫙 열립니다 */}
        {showMemory && (
          <div className="mt-3 bg-white/70 rounded-2xl p-4 shadow-inner border border-pink-50 max-h-[250px] overflow-y-auto space-y-2">
            {isLoadingMemories && <p className="text-sm text-gray-400 text-center py-2">불러오는 중... 💫</p>}
            
            {!isLoadingMemories && memories.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">저장된 메모리가 없습니다.</p>
            )}

            {!isLoadingMemories && memories.map((item) => (
              <div key={item.id} className="space-y-2">
                {/* 메모리 텍스트 아이템 */}
                <div 
                  onClick={() => setSelectedMemoryId(selectedMemoryId === item.id ? null : item.id)}
                  className={`p-3 rounded-xl text-sm transition-all cursor-pointer ${
                    selectedMemoryId === item.id 
                      ? 'bg-pink-100 text-pink-700 font-bold border border-pink-200' 
                      : 'bg-white text-gray-600 hover:bg-white/90 border border-transparent'
                  }`}
                >
                  {item.content}
                </div>

                {/* 메모리를 누르면 바로 밑에 스윽 나타나는 삭제 버튼! */}
                {selectedMemoryId === item.id && (
                  <button
                    onClick={() => handleDeleteMemory(item.id)}
                    className="w-full bg-red-50 text-red-500 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-all transform active:scale-95"
                  >
                    ❌ 이 메모리 삭제하기
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 로그아웃 버튼 (하단 고정) */}
      <div className="mt-auto pt-6 border-t border-pink-200 flex justify-between items-center">
        <button 
          onClick={onLogout}
          className="bg-[#FF9E9E] text-white text-lg font-black py-4 px-10 rounded-2xl shadow-lg hover:bg-[#FF8585] transition-all transform active:scale-95">
          로그아웃
        </button>
        <button 
          onClick={onOpenSettings}
          className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm hover:shadow-md transition-all text-gray-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
}