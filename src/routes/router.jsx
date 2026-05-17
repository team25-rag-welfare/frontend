import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound.jsx';
import Ex from '../component/ex.jsx';
import KakaoCallback from '../pages/KakaoCallback.jsx';
import Terms from '../pages/Terms.jsx';
import ChatPage from '../pages/ChatPage.jsx';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ex" element={<Ex />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path='/test-chat' element={<ChatPage />} />
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default Router;