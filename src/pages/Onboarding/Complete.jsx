import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SuccessIcon } from '../../assets/images/sucess.svg';
import './Complete.css';

function Complete() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page complete-page">
      <SuccessIcon className="complete-badge" />

      <p className="complete-title">등록이 완료되었어요.</p>
      <p className="complete-subtitle">3초 뒤에 홈 화면으로 이동합니다.</p>
    </div>
  );
}

export default Complete;
