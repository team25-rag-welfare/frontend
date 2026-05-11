import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound.jsx';
import Ex from '../component/ex.jsx';
import KakaoCallback from '../pages/KakaoCallback.jsx';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ex" element={<Ex />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;