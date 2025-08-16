import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateUserInfo } from '../../store/userInfo';
import axios from 'axios';
import { hostInstance } from '../../api/hostInstance';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const pgToken = searchParams.get('pg_token');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(pgToken);
        const approvePayment = async () => {
            // try {
            //     const res = await hostInstance.post('/pay/approve', {
            //         method: 'POST',
            //         headers: { 'Content-Type': 'application/json' },
            //         body: JSON.stringify({ pgToken }),
            //         credentials: 'include',
            //     });
            //     // Redux 업데이트
            //    // dispatch(updateUserInfo(updatedUser));
            //     alert('구독이 완료되었습니다 🎉');
            //     navigate('/');
            // } catch (err) {
            //     console.error(err);
            //     alert('결제 승인 중 오류가 발생했습니다.');
            //     navigate('/');
            // }
        };

        if (pgToken) {
            approvePayment();
        }
    }, [pgToken, dispatch, navigate]);

    return (
        <div className="text-center mt-20 text-xl">구독 확인 중입니다...</div>
    );
};

export default PaymentSuccess;
