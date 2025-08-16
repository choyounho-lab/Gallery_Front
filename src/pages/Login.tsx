import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { v4 } from 'uuid';
import { getCurrentUser, setCurrentUser } from '../helper/storage';
import { setUserInfo } from '../store/userInfo';
import { osName } from 'react-device-detect';
import axios from 'axios';
import '../assets/css/Login.css';
import { apiSignUp } from '../api/api';
import { hostInstance } from '../api/hostInstance';
import { table } from 'console';

interface LoginProps {
    onClose?: () => void;
}

const Login = ({ onClose }: LoginProps) => {
    const [loginPage, setLoginPage] = useState(true);

    const [isSignup, setIsSignup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);
    const [findType, setFindType] = useState<'id' | 'pw' | null>(null);
    const [findIdEmail, setFindIdEmail] = useState('');
    const [findIdCode, setFindIdCode] = useState('');
    const [isIdVerified, setIsIdVerified] = useState(false);
    const [foundUsername, setFoundUsername] = useState('');
    const [findIdName, setFindIdName] = useState('');
    const [findIdBirth, setFindIdBirth] = useState('');
    const [foundId, setFoundId] = useState('');

    const [pwName, setPwName] = useState('');
    const [pwEmail, setPwEmail] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [serverCode, setServerCode] = useState('');
    const [pwVerified, setPwVerified] = useState(false);
    const [newPw, setNewPw] = useState('');
    const [newPwConfirm, setNewPwConfirm] = useState('');

    //2025-07-08  조윤호 이메일 인증 작업 시작

    const dispatch = useDispatch();

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
        deviceInfo: {
            deviceId: v4(),
            deviceType: '',
            notificationToken: v4(),
        },
    });

    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthdate: '',
        gender: '',
    });

    const [signupError, setSignupError] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const closeLoginPage = () => {
        setLoginPage(false);
        onClose?.(); // ✅ 모달 닫기
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.id]: e.target.value });
    };

    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSignupData({ ...signupData, [id]: value });
        setSignupError({ ...signupError, [id]: '' });
    };

    const validateSignup = () => {
        const { name, email, password, confirmPassword } = signupData;
        const errors: typeof signupError = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        if (!/^[가-힣a-zA-Z]{2,20}$/.test(name)) {
            errors.name = '이름은 2~20자의 한글 또는 영문만 가능합니다.';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = '유효한 이메일 주소를 입력해주세요.';
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            errors.password =
                '비밀번호는 8자 이상이며, 영문과 숫자를 포함해야 합니다.';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }

        setSignupError(errors);
        return Object.values(errors).every((v) => v === '');
    };

    /**
     * 회원 가입 처리 : 유효성 검사가 끝난 후 호출 할것
     */
    const actionSignUp = () => {
        setIsLoading(true);
        console.table({
            name: signupData.name,
            email: signupData.email,
            password: signupData.password,
            birthDate: signupData.birthdate,
            userGender: signupData.gender,
            roleId: 1,
            // 필요한 추가 필드 있으면 여기에 같이 보내기
        });

        hostInstance
            .post('auth/register', {
                name: signupData.name,
                email: signupData.email,
                password: signupData.password,
                birthDate: signupData.birthdate,
                userGender: signupData.gender,
                roleId: 1,
                // 필요한 추가 필드 있으면 여기에 같이 보내기
            })
            .then((res) => {
                alert('회원가입이 완료되었습니다.');
                setIsSignup(false); // 로그인 화면으로 전환
            })
            .catch((err) => {
                alert(err.response?.data?.message || '회원가입 실패');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        console.log(loginData);

        axios
            .post(`${process.env.REACT_APP_HOST}auth/login`, loginData)
            .then((res) => {
                if (res.data) {
                    const { tokenType, accessToken } = res.data;

                    axios
                        .get(`${process.env.REACT_APP_HOST}user/me`, {
                            headers: {
                                Authorization: `${tokenType} ${accessToken}`,
                            },
                        })
                        .then((result) => {
                            console.log(res.data);
                            console.log(result.data);
                            setCurrentUser(res.data);
                            dispatch(setUserInfo(result.data));
                            setLoginPage(false);
                            onClose?.(); // ✅ 로그인 성공 시 모달 닫기
                        })
                        .catch(() => {
                            alert('사용자 정보 조회 실패');
                        })
                        .finally(() => setIsLoading(false));
                }
            })
            .catch((err) => {
                alert(err.response?.data?.message || '로그인 실패');
                setIsLoading(false);
            });
    };

    const authEmail = () => {
        console.log({
            mail: pwEmail, // ✅ 실제 이메일 변수로 변경
            subject: '비밀번호 재설정 인증메일',
            mailType: 'emailAuth',
            name: pwName,
        });
        hostInstance
            .post(
                '/auth/mail',
                {
                    email: pwEmail, // ✅ 실제 이메일 변수로 변경
                    subject: '비밀번호 재설정 인증메일',
                    mailType: 'emailAuth',
                    name: pwName,
                    step: 'send', // ✅ 추가
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000, // ✅ 여기 추가 (10초)
                }
            )
            .then((res) => {
                alert('인증번호가 전송되었습니다');
                setServerCode(res.data.message?.split('인증코드: ')[1] ?? '');
            })
            .catch(() => {
                alert('인증번호 전송 실패');
            });
    };

    // useEffect(() => {
    //     if (loginPage && !findType) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = 'auto';
    //     }

    //     return () => {
    //         document.body.style.overflow = 'auto';
    //     };
    // }, [loginPage, findType]);

    useEffect(() => {
        getCurrentUser();

        let device = '';
        switch (osName) {
            case 'Windows':
                device = 'DEVICE_TYPE_WINDOWS';
                break;
            case 'Mac OS':
                device = 'DEVICE_TYPE_MACOS';
                break;
            case 'Android':
                device = 'DEVICE_TYPE_ANDROID';
                break;
            case 'iOS':
                device = 'DEVICE_TYPE_IOS';
                break;
            default:
                device = 'OTHER';
        }

        setLoginData((prev) => ({
            ...prev,
            deviceInfo: {
                ...prev.deviceInfo,
                deviceType: device,
            },
        }));
    }, []);

    //2025-06-30  조윤호 로그인 관련
    return (
        <div>
            {loginPage && !findType && (
                <div className="bg-overlay">
                    <div className="section">
                        <div className="container mx-auto">
                            <div className="row full-height justify-content-center">
                                <div className="col-12 text-center align-self-center py-5">
                                    <div className="section pb-5 pt-5 pt-sm-2 text-center">
                                        <input
                                            className="checkbox"
                                            type="checkbox"
                                            id="reg-log"
                                            name="reg-log"
                                            checked={isSignup}
                                            onChange={(e) =>
                                                setIsSignup(e.target.checked)
                                            }
                                        />
                                        <label
                                            htmlFor="reg-log"
                                            className="auth-toggle-label"
                                        >
                                            {isSignup ? '로그인' : '회원가입'}
                                        </label>
                                        <div className="card-3d-wrap mx-auto">
                                            <div
                                                className={`card-3d-wrapper ${
                                                    isSignup ? 'flipped' : ''
                                                }`}
                                            >
                                                <div
                                                    className="card-front"
                                                    style={{
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <button
                                                        className="close-btn"
                                                        onClick={closeLoginPage}
                                                    >
                                                        ✖
                                                    </button>
                                                    <div className="center-wrap">
                                                        <div className="section text-center">
                                                            <h4 className="mb-4 pb-3">
                                                                EchoCaine
                                                            </h4>
                                                            <form
                                                                onSubmit={
                                                                    onSubmit
                                                                }
                                                            >
                                                                <div className="form-group">
                                                                    <input
                                                                        type="text"
                                                                        id="username"
                                                                        className="form-style"
                                                                        placeholder="이메일"
                                                                        onChange={
                                                                            onChange
                                                                        }
                                                                        required
                                                                    />
                                                                    <i className="input-icon uil uil-at" />
                                                                </div>
                                                                <div className="form-group mt-2">
                                                                    <input
                                                                        type="password"
                                                                        id="password"
                                                                        className="form-style"
                                                                        placeholder="비밀번호"
                                                                        onChange={
                                                                            onChange
                                                                        }
                                                                        required
                                                                    />
                                                                    <i className="input-icon uil uil-lock-alt" />
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        className="btn mt-4"
                                                                        type="submit"
                                                                        disabled={
                                                                            isLoading
                                                                        }
                                                                    >
                                                                        로그인
                                                                    </button>
                                                                </div>
                                                            </form>
                                                            <p className="mb-0 mt-4 text-center">
                                                                <span
                                                                    className="link"
                                                                    style={{
                                                                        marginRight:
                                                                            '20px',
                                                                    }}
                                                                    onClick={() => {
                                                                        setFindType(
                                                                            'id'
                                                                        );
                                                                        setLoginPage(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    아이디 찾기
                                                                </span>
                                                                <span
                                                                    className="link"
                                                                    onClick={() => {
                                                                        setFindType(
                                                                            'pw'
                                                                        );
                                                                        setLoginPage(
                                                                            false
                                                                        );
                                                                    }}
                                                                >
                                                                    비밀번호
                                                                    찾기
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="card-back">
                                                    <div className="center-wrap">
                                                        <div className="section text-center">
                                                            <h4 className="mb-4 pb-3">
                                                                EchoCaine
                                                            </h4>

                                                            <div className="form-group">
                                                                <input
                                                                    type="text"
                                                                    id="name"
                                                                    className="form-style"
                                                                    placeholder="이름"
                                                                    onChange={
                                                                        handleSignupChange
                                                                    }
                                                                />
                                                                <i className="input-icon uil uil-user" />
                                                                {signupError.name && (
                                                                    <span className="input-error">
                                                                        {
                                                                            signupError.name
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div
                                                                className="form-group"
                                                                style={{
                                                                    textAlign:
                                                                        'left',
                                                                }}
                                                            >
                                                                <div
                                                                    className="form-group"
                                                                    style={{
                                                                        textAlign:
                                                                            'left',
                                                                    }}
                                                                >
                                                                    <label></label>
                                                                    <div>
                                                                        <label
                                                                            style={{
                                                                                marginRight:
                                                                                    '15px',
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="radio"
                                                                                name="gender"
                                                                                value="M"
                                                                                checked={
                                                                                    signupData.gender ===
                                                                                    'M'
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setSignupData(
                                                                                        {
                                                                                            ...signupData,
                                                                                            gender: e
                                                                                                .target
                                                                                                .value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                            />
                                                                            남자
                                                                        </label>
                                                                        <label>
                                                                            <input
                                                                                type="radio"
                                                                                name="gender"
                                                                                value="F"
                                                                                checked={
                                                                                    signupData.gender ===
                                                                                    'F'
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    setSignupData(
                                                                                        {
                                                                                            ...signupData,
                                                                                            gender: e
                                                                                                .target
                                                                                                .value,
                                                                                        }
                                                                                    )
                                                                                }
                                                                            />
                                                                            여자
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                                <div className="form-group">
                                                                    <input
                                                                        type="email"
                                                                        id="email"
                                                                        className="form-style"
                                                                        placeholder="이메일"
                                                                        onChange={
                                                                            handleSignupChange
                                                                        }
                                                                    />
                                                                    <i className="input-icon uil uil-at" />
                                                                    {signupError.email && (
                                                                        <span className="input-error">
                                                                            {
                                                                                signupError.email
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="form-group">
                                                                    <input
                                                                        type="password"
                                                                        id="password"
                                                                        className="form-style"
                                                                        placeholder="비밀번호"
                                                                        onChange={
                                                                            handleSignupChange
                                                                        }
                                                                    />
                                                                    <i className="input-icon uil uil-lock-alt" />
                                                                    {signupError.password && (
                                                                        <span className="input-error">
                                                                            {
                                                                                signupError.password
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <div className="form-group">
                                                                    <input
                                                                        // onKeyDown={() => {
                                                                        //     if (
                                                                        //         !agreeTerms ||
                                                                        //         !agreePrivacy
                                                                        //     ) {
                                                                        //         alert(
                                                                        //             '필수 약관에 모두 동의해야 합니다.'
                                                                        //         );
                                                                        //         return;
                                                                        //     }
                                                                        //     if (
                                                                        //         validateSignup()
                                                                        //     ) {
                                                                        //         console.log(
                                                                        //             '회원가입 진행'
                                                                        //         );
                                                                        //         console.log(
                                                                        //             '입력한 생년월일:',
                                                                        //             signupData.birthdate
                                                                        //         );
                                                                        //         console.log(
                                                                        //             '✅ 선택한 성별:',
                                                                        //             signupData.gender
                                                                        //         );
                                                                        //         actionSignUp();
                                                                        //     }
                                                                        // }}
                                                                        type="password"
                                                                        id="confirmPassword"
                                                                        className="form-style"
                                                                        placeholder="비밀번호 확인"
                                                                        onChange={
                                                                            handleSignupChange
                                                                        }
                                                                    />

                                                                    <i className="input-icon uil uil-lock-alt" />
                                                                    {signupError.confirmPassword && (
                                                                        <span className="input-error">
                                                                            {
                                                                                signupError.confirmPassword
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    id="birthdate"
                                                                    className="form-style"
                                                                    placeholder="생년월일 (예: 990101)"
                                                                    onChange={
                                                                        handleSignupChange
                                                                    }
                                                                />

                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            agreeTerms
                                                                        }
                                                                        onChange={() =>
                                                                            setAgreeTerms(
                                                                                !agreeTerms
                                                                            )
                                                                        }
                                                                    />
                                                                    [필수]{' '}
                                                                    <a
                                                                        href="/terms"
                                                                        target="_blank"
                                                                    >
                                                                        이용약관
                                                                    </a>{' '}
                                                                    동의
                                                                </label>
                                                                <br />
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            agreePrivacy
                                                                        }
                                                                        onChange={() =>
                                                                            setAgreePrivacy(
                                                                                !agreePrivacy
                                                                            )
                                                                        }
                                                                    />
                                                                    [필수]{' '}
                                                                    <a
                                                                        href="/privacy"
                                                                        target="_blank"
                                                                    >
                                                                        개인정보처리방침
                                                                    </a>{' '}
                                                                    동의
                                                                </label>
                                                                <br />
                                                                <label>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            agreeMarketing
                                                                        }
                                                                        onChange={() =>
                                                                            setAgreeMarketing(
                                                                                !agreeMarketing
                                                                            )
                                                                        }
                                                                    />
                                                                    [선택]
                                                                    마케팅 수신
                                                                    동의
                                                                </label>
                                                            </div>

                                                            <button
                                                                className="btn mt-4"
                                                                onClick={() => {
                                                                    if (
                                                                        !agreeTerms ||
                                                                        !agreePrivacy
                                                                    ) {
                                                                        alert(
                                                                            '필수 약관에 모두 동의해야 합니다.'
                                                                        );
                                                                        return;
                                                                    }
                                                                    if (
                                                                        validateSignup()
                                                                    ) {
                                                                        console.log(
                                                                            '회원가입 진행'
                                                                        );
                                                                        console.log(
                                                                            '입력한 생년월일:',
                                                                            signupData.birthdate
                                                                        );
                                                                        console.log(
                                                                            '✅ 선택한 성별:',
                                                                            signupData.gender
                                                                        );
                                                                        actionSignUp();
                                                                    }
                                                                }}
                                                            >
                                                                회원가입
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {findType === 'id' && (
                <div className="find-box">
                    <h2>아이디 찾기</h2>
                    <input
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={findIdName}
                        onChange={(e) => setFindIdName(e.target.value)}
                        className="form-style find-input"
                    />
                    <input
                        type="text"
                        placeholder="생년월일 (예: 990101)"
                        value={findIdBirth}
                        onChange={(e) => setFindIdBirth(e.target.value)}
                        className="form-style find-input"
                    />
                    <button
                        className="btn"
                        onClick={() => {
                            if (!findIdName || !findIdBirth) {
                                alert('이름과 생년월일을 모두 입력하세요');
                                return;
                            }

                            hostInstance
                                .get('/auth/find-id', {
                                    params: {
                                        name: findIdName,
                                        birthDate: findIdBirth,
                                    },
                                })
                                .then((res) => {
                                    console.log(res.data);
                                    setFoundId(res.data); // ✅ 이메일 저장
                                })
                                .catch(() => {
                                    alert('사용자를 찾을 수 없습니다');
                                    setFoundId('');
                                });
                        }}
                    >
                        아이디 찾기
                    </button>
                    {foundId && (
                        <p style={{ marginTop: '10px' }}>
                            ✅ 당신의 이메일: <strong>{foundId}</strong>
                        </p>
                    )}
                    <button
                        className="btn"
                        onClick={() => {
                            setFindType(null);
                            setLoginPage(true);
                        }}
                    >
                        닫기
                    </button>
                </div>
            )}

            {findType === 'pw' && (
                <div className="find-box">
                    <h2>비밀번호 재설정</h2>

                    <input
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={pwName}
                        onChange={(e) => setPwName(e.target.value)}
                        className="form-style find-input"
                    />
                    <input
                        type="text"
                        placeholder="이메일을 입력하세요"
                        value={pwEmail}
                        onChange={(e) => setPwEmail(e.target.value)}
                        className="form-style find-input"
                    />

                    {!pwVerified ? (
                        <>
                            <button className="btn" onClick={authEmail}>
                                인증번호 전송
                            </button>

                            <input
                                type="text"
                                placeholder="인증번호 입력"
                                value={authCode}
                                onChange={(e) => setAuthCode(e.target.value)}
                                className="form-style find-input"
                            />
                            <button
                                className="btn"
                                onClick={() => {
                                    console.log({
                                        step: 'verify',
                                        name: pwName,
                                        email: pwEmail,
                                        authCode: authCode,
                                    });
                                    hostInstance
                                        .post('/auth/reset-password', {
                                            step: 'verify',
                                            name: pwName,
                                            email: pwEmail,
                                            authCode: authCode,
                                        })
                                        .then((res) => {
                                            console.log(res.data.SUCCESS);
                                            if (res.data.SUCCESS) {
                                                alert('인증 성공');
                                                setPwVerified(true);
                                            } else {
                                                alert(
                                                    '일치하는 정보가 없습니다'
                                                );
                                            }

                                            //alert('인증 성공');
                                        })

                                        .catch(() => {
                                            alert('인증 실패');
                                        });
                                }}
                            >
                                인증 확인
                            </button>
                        </>
                    ) : (
                        <>
                            <input
                                type="password"
                                placeholder="새 비밀번호"
                                value={newPw}
                                onChange={(e) => setNewPw(e.target.value)}
                                className="form-style find-input"
                            />
                            <input
                                type="password"
                                placeholder="비밀번호 확인"
                                value={newPwConfirm}
                                onChange={(e) =>
                                    setNewPwConfirm(e.target.value)
                                }
                                className="form-style find-input"
                            />
                            <button
                                className="btn"
                                onClick={() => {
                                    if (newPw !== newPwConfirm) {
                                        alert('비밀번호가 일치하지 않습니다');
                                        return;
                                    }

                                    console.log({
                                        step: 'change',
                                        name: pwName,
                                        email: pwEmail,
                                        newPassword: newPw,
                                    });

                                    hostInstance
                                        .post('/auth/reset-password', {
                                            step: 'change',
                                            name: pwName,
                                            email: pwEmail,
                                            newPassword: newPw,
                                        })
                                        .then(() => {
                                            alert(
                                                '비밀번호가 재설정되었습니다'
                                            );
                                            setFindType(null);
                                            setLoginPage(true);
                                        })
                                        .catch(() => {
                                            alert('비밀번호 재설정 실패');
                                        });
                                }}
                            >
                                비밀번호 재설정
                            </button>
                        </>
                    )}

                    <button
                        className="btn"
                        onClick={() => {
                            setFindType(null);
                            setLoginPage(true);
                        }}
                    >
                        닫기
                    </button>
                </div>
            )}
        </div>
    );
};

export default Login;
