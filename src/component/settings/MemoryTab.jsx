import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function MemoryTab() {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const token = () => localStorage.getItem('access_token');

  useEffect(() => {
    if (!token()) return;
    const fetchMemories = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/v1/memories`, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        setMemories(res.data);
      } catch (error) {
        console.error('메모리 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/v1/memories/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setMemories((prev) => prev.filter((m) => m.memoryId !== id));
      setConfirmId(null);
    } catch (error) {
      console.error('메모리 삭제 실패:', error);
      alert('메모리 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, color: 'var(--ink-lt)', fontSize: 14 }}>
        불러오는 중...
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, gap: 8 }}>
        <span style={{ fontSize: 32 }}>🗂️</span>
        <p style={{ fontSize: 14, color: 'var(--ink-lt)' }}>저장된 메모리가 없어요.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ fontSize: 13, color: 'var(--ink-lt)', marginBottom: 4 }}>
        산책이 대화에서 기억한 내용이에요. 불필요한 항목은 삭제할 수 있어요.
      </p>
      {memories.map((memory) => (
        <div
          key={memory.memoryId}
          style={{
            background: 'var(--snow)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px',
            transition: 'all .15s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6, flex: 1 }}>{memory.content}</p>
            <button
              onClick={() => setConfirmId(confirmId === memory.memoryId ? null : memory.memoryId)}
              style={{ flexShrink: 0, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--ink-hint)', padding: '2px 4px' }}
            >
              ✕
            </button>
          </div>
          {confirmId === memory.memoryId && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--ink-lt)', flex: 1 }}>정말 삭제할까요?</span>
              <button
                onClick={() => setConfirmId(null)}
                style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--cream)', color: 'var(--ink-lt)', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                취소
              </button>
              <button
                onClick={() => handleDelete(memory.memoryId)}
                style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, border: 'none', background: 'var(--petal)', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}
              >
                삭제
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
