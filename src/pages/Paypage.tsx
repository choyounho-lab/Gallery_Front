// src/pages/PayPage.tsx
import KakaoPayButton from '../components/KakaoPayButton';

const PayPage = () => {
    return (
        <div className="p-4">
            <h2>🛒 결제 페이지</h2>
            <KakaoPayButton />
        </div>
    );
};

export default PayPage;
