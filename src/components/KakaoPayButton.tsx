// src/components/KakaoPayButton.tsx

import React from 'react';

const KakaoPayButton: React.FC = () => {
    const handleKakaoPay = async () => {
        try {
            const res = await fetch('http://localhost:8001/pay/ready', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_name: '테스트 상품',
                    quantity: 1,
                    total_amount: 1000,
                }),
            });

            const data = await res.json();
            if (data.next_redirect_pc_url) {
                window.location.href = data.next_redirect_pc_url;
            } else {
                alert('카카오페이 연결 실패!');
            }
        } catch (err) {
            console.error('카카오페이 오류', err);
            alert('결제 요청 중 오류가 발생했습니다.');
        }
    };

    return <button onClick={handleKakaoPay}>카카오페이로 결제하기</button>;
};

export default KakaoPayButton;
