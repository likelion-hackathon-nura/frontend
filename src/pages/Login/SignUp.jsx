import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { signup } from '../../api/auth';
import { ApiError } from '../../api/client';
import './SignUp.css';

const EMAIL_DOMAINS = ['naver.com', 'daum.net', 'hanmail.net', 'gmail.com', '직접 입력'];

const SIGNUP_ERROR_MESSAGES = {
  AUTH_INVALID_SIGNUP_REQUEST: '회원가입 정보를 확인해 주세요.',
  AUTH_EMAIL_ALREADY_EXISTS: '이미 가입된 이메일입니다.',
};

function SignUp() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [domainListOpen, setDomainListOpen] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectDomain = (value) => {
    setDomain(value);
    setDomainListOpen(false);
    if (value !== '직접 입력') {
      setCustomDomain('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (password.length < 8 || password.length > 20) {
      setError('비밀번호는 8~20자로 입력해 주세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    const fullEmail = `${email}@${domain === '직접 입력' ? customDomain : domain}`;

    setError('');
    setIsSubmitting(true);
    try {
      await signup({ email: fullEmail, password, nickname });
      navigate('/');
    } catch (err) {
      const message = err instanceof ApiError ? SIGNUP_ERROR_MESSAGES[err.code] ?? err.message : '회원가입에 실패했어요. 다시 시도해 주세요.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page signup-page">
      <div className="signup-header">
        <button type="button" className="signup-back" onClick={() => navigate('/')} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <h1>회원가입</h1>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="signup-field">
          <label htmlFor="signup-nickname">닉네임</label>
          <input
            id="signup-nickname"
            className="input"
            type="text"
            placeholder="닉네임을 입력해 주세요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <p className="signup-hint">4~12자/한글, 영문 소문자(숫자 조합 가능)</p>
        </div>

        <div className="signup-field">
          <label htmlFor="signup-password">비밀번호</label>
          <input
            id="signup-password"
            className="input signup-password-input"
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="input signup-password-input"
            type="password"
            placeholder="비밀번호를 다시 한 번 입력해 주세요."
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          <p className="signup-hint">8~20자/영문 대문자, 소문자, 숫자, 특수문자 중 2가지 이상 포함</p>
        </div>

        <div className="signup-field">
          <label htmlFor="signup-email">이메일</label>
          <div className="signup-email-row">
            <input
              id="signup-email"
              className="input signup-email-input"
              type="text"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="signup-at">@</span>
            <div className="signup-domain">
              {domain === '직접 입력' ? (
                <input
                  className="input"
                  type="text"
                  placeholder="도메인 입력"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                />
              ) : (
                <button
                  type="button"
                  className="signup-domain-toggle"
                  onClick={() => setDomainListOpen((open) => !open)}
                >
                  <span>{domain || '선택'}</span>
                  <svg
                    className={domainListOpen ? 'signup-chevron signup-chevron-up' : 'signup-chevron'}
                    width="8"
                    height="16"
                    viewBox="0 0 8 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 5L4 11L7 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}

              {domainListOpen && (
                <ul className="signup-domain-list">
                  {EMAIL_DOMAINS.map((d) => (
                    <li key={d}>
                      <button type="button" onClick={() => handleSelectDomain(d)}>
                        {d}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {error && <p className="signup-hint signup-hint-error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-full signup-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? '가입 중...' : '가입 완료'}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
