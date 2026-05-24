import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound.jsx';
import Ex from '../component/ex.jsx';
import KakaoCallback from '../pages/KakaoCallback.jsx';
import Terms from '../pages/Terms.jsx';
import ChatPage from '../pages/ChatPage.jsx';
import Onboarding from '../component/Onboarding.jsx';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ex" element={<Ex />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/login" element={<Home />} />
        <Route path='/onboarding' element={<Onboarding onClose={() => window.location.href = '/chat'} />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path='/test-chat' element={<ChatPage />} />
        <Route path="*" element={<NotFound />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default Router;