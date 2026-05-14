import React from 'react';
import { useState } from 'react'
import './App.css'
import useStore from './store/useStore';
import Router from './routes/router';
import ChatPage from './pages/ChatPage';


function App() {
  
  return (
    <div className="App">
      {/*화면 한가운데에 채팅창 하나 띄웁니다.*/}
      <ChatPage />
    </div>

  );
    
}

export default App;
