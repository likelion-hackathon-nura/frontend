import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { ApiError } from '../../api/client';
import { setTokens } from '../../api/tokenStorage';
import './Login.css';

const LOGIN_ERROR_MESSAGES = {
  AUTH_INVALID_LOGIN_REQUEST: '이메일과 비밀번호를 입력해 주세요.',
  AUTH_INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
};

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);
    try {
      const data = await login({ email, password });
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      navigate(data.onboardingCompleted ? '/home' : '/onboarding/step1');
    } catch (err) {
      const message = err instanceof ApiError ? LOGIN_ERROR_MESSAGES[err.code] ?? err.message : '로그인에 실패했어요. 다시 시도해 주세요.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="login-logo" />

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="email"
          placeholder="이메일을 입력해 주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="login-links">
        <Link to="/find-id">아이디 찾기</Link>
        <span>|</span>
        <Link to="/find-password">비밀번호 찾기</Link>
        <span>|</span>
        <Link to="/signup">회원가입</Link>
      </div>

      <div className="login-footer">
        <Link to="/signup">이미 AAC 회원이신가요?</Link>
      </div>
    </div>
  );
}

export default Login;
