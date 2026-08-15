import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SuccessIcon } from '../../assets/images/sucess.svg';
import './RegisterComplete.css';

function RegisterComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page register-complete-page">
      <SuccessIcon className="register-complete-badge" />

      <p className="register-complete-title">근무표 등록이 완료되었어요.</p>
      <p className="register-complete-subtitle">3초 뒤에 홈 화면으로 이동합니다.</p>
    </div>
  );
}

export default RegisterComplete;
