import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SuccessIcon } from '../../assets/images/sucess.svg';
import './ScheduleComplete.css';

function ScheduleComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page schedule-complete-page">
      <SuccessIcon className="schedule-complete-badge" />

      <p className="schedule-complete-title">일정 등록이 완료되었어요.</p>
      <p className="schedule-complete-subtitle">3초 뒤에 홈화면으로 이동합니다.</p>
    </div>
  );
}

export default ScheduleComplete;
