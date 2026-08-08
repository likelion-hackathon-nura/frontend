import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/onboarding/step1');
  };

  return (
    <div className="page login-page">
      <div className="login-logo" />

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="아이디를 입력해 주세요."
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-full">
          로그인
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
