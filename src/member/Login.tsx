import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { instance } from "../api/instance"; // 경로 확인

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0b0c10;
  color: #fff;
  padding-top: 72px; /* 헤더 높이만큼 */
`;

const Card = styled.div`
  width: min(420px, 92vw);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 28px;
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
`;

const Title = styled.h2`
  margin: 0 0 18px;
  font-weight: 800;
`;

const Field = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
`;

const Label = styled.label`
  font-size: 14px;
  opacity: 0.95;
`;

const Input = styled.input`
  height: 44px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #4b4f58;
  background: #15171c;
  color: #fff;
  outline: none;
  &::placeholder {
    color: #9aa0aa;
  }
  &:focus {
    border-color: #00eaff;
    box-shadow: 0 0 0 3px #00eaff22;
    background: #0f1115;
  }
`;

const Submit = styled.button`
  height: 46px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #00eaff;
  background: #00eaff;
  color: #04121a;
  font-weight: 800;
  cursor: pointer;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(0, 234, 255, 0.25);
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

const ErrorMsg = styled.p`
  margin: 6px 0 0;
  color: #ff6b6b;
  font-size: 13px;
`;

const Login: React.FC = () => {
  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }
    setPending(true);
    try {
      const res = await instance.post("/auth/login", { username, password });
      const { accessToken, user, role } = res.data; // 실제 백엔드 구조에 맞게 수정

      localStorage.setItem("accessToken", accessToken);
      if (role !== undefined) localStorage.setItem("role", String(role));
      if (user) localStorage.setItem("user", JSON.stringify(user));

      nav(from, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>로그인</Title>
        <form onSubmit={onSubmit}>
          <Field>
            <Label>아이디</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디 또는 이메일"
            />
          </Field>
          <Field>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
            />
          </Field>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Submit disabled={pending}>
            {pending ? "로그인 중..." : "로그인"}
          </Submit>
        </form>
      </Card>
    </Page>
  );
};

export default Login;
