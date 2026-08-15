import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as HomeSpinnerIcon } from '../../assets/images/home-spinner.svg';
import './ScanLoading.css';

function ScanLoading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/work-schedule/scan-result');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page scan-loading-page">
      <HomeSpinnerIcon className="scan-spinner" />

      <p className="scan-loading-title">근무표를 스캔하고 있어요...</p>
      <p className="scan-loading-subtitle">
        잠시만 기다려주세요
        <br />
        D/E/N/OFF 정보를 추출 중이에요
      </p>
    </div>
  );
}

export default ScanLoading;
