import KakaoLoginButton from '../component/KakaoLoginButton';

function Home(){
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px' }}>
            <h1>Home</h1>
            <KakaoLoginButton />
        </div>
    );
}

export default Home;