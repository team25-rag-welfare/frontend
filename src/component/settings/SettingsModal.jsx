import React, { useState } from 'react';
import MemoryTab from './MemoryTab';

const TABS = [
  { key: 'memory', label: '메모리' },
];

export default function SettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('memory');

  return (
    <div className="settings-overlay">
      <div className="settings-modal">

        <div className="settings-header">
          <span>설정</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="settings-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`settings-tab ${activeTab === tab.key ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'memory' && <MemoryTab />}
        </div>
      </div>
    </div>
  );
}
