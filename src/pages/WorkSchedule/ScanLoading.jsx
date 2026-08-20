import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as HomeSpinnerIcon } from '../../assets/images/home-spinner.svg';
import { ocrSchedules } from '../../api/schedule';
import { ApiError } from '../../api/client';
import './ScanLoading.css';

function ScanLoading() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const file = location.state?.file;
    if (!file) {
      navigate('/work-schedule/manual-entry', { replace: true });
      return;
    }

    let cancelled = false;
    ocrSchedules(file)
      .then((data) => {
        if (cancelled) return;
        navigate('/work-schedule/scan-result', { replace: true, state: { schedules: data.schedules } });
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof ApiError ? err.message : '근무표 인식에 실패했어요. 다시 시도해 주세요.';
        navigate('/work-schedule/manual-entry', { replace: true, state: { ocrError: message } });
      });

    return () => {
      cancelled = true;
    };
  }, [location.state, navigate]);

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
