import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { createEvent } from '../../api/event';
import { ApiError } from '../../api/client';
import './RefreshTimeWarning.css';

// y축은 실제 값에 맞춰 4시간 폭으로 잡는다. 그리드라인은 위/중간/아래 3개이고
// 막대 바닥이 가장 아래 그리드라인에 닿는다. (예: 9시간 → 9/7/5, 4시간 30분 → 5/3/1)
const CHART_SPAN_HOURS = 4;

function getChartAxis(before, after) {
  const topHours = Math.max(Math.ceil(Math.max(before, after) / 60), 1);
  const bottomHours = Math.max(topHours - CHART_SPAN_HOURS, 0);
  const midHours = (topHours + bottomHours) / 2;
  return {
    maxMinutes: topHours * 60,
    minMinutes: bottomHours * 60,
    gridValues: [topHours, midHours, bottomHours],
  };
}

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours && minutes) return `${hours}시간 ${minutes}분`;
  if (hours) return `${hours}시간`;
  return `${minutes}분`;
}

function WarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3L22 20H2L12 3Z"
        fill="#F18E8E"
      />
      <rect x="11.1" y="9.5" width="1.8" height="5.5" rx="0.9" fill="white" />
      <circle cx="12" cy="17" r="1.1" fill="white" />
    </svg>
  );
}

function RefreshTimeChart({ before, after }) {
  const chartHeight = 127;
  const barWidth = 46;
  const { maxMinutes, minMinutes, gridValues } = getChartAxis(before, after);
  const chartRangeMinutes = maxMinutes - minMinutes;
  const minutesToHeight = (minutes) =>
    Math.min(Math.max((minutes - minMinutes) / chartRangeMinutes, 0), 1) * chartHeight;
  const beforeHeight = minutesToHeight(before);
  const afterHeight = minutesToHeight(after);
  const bottomGridValue = gridValues[gridValues.length - 1];

  const beforeX = 81.3;
  const afterX = 182;
  const beforeTopY = chartHeight - beforeHeight;
  const afterTopY = chartHeight - afterHeight;

  const topOffset = 48;

  return (
    <svg className="refresh-warning-chart" viewBox="0 0 300 225" width="100%">
      <text x="279.3" y="35" textAnchor="end" className="refresh-warning-chart-unit">
        단위 : 시간
      </text>

      <g transform={`translate(0, ${topOffset})`}>
      {gridValues.map((v) => {
        // 가장 아래 그리드라인만 막대 바닥에서 8px(렌더 기준) 아래로 살짝 띄움
        const y = v === bottomGridValue ? chartHeight + 6.92 : chartHeight - minutesToHeight(v * 60);
        return (
          <g key={v}>
            <line x1="24" y1={y} x2="275.9" y2={y} stroke="#E5DEDF" strokeWidth="1" strokeDasharray="3 3" />
            <text x="20.75" y={y + 4} className="refresh-warning-chart-axis">
              {v}
            </text>
          </g>
        );
      })}

      <rect x={beforeX} y={beforeTopY} width={barWidth} height={beforeHeight} rx="10" fill="#D9D9D9" />
      <rect
        x={afterX}
        y={beforeTopY}
        width={barWidth}
        height={beforeHeight}
        rx="10"
        fill="#FFF1F1"
        stroke="#FFC7C7"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <rect x={afterX} y={afterTopY} width={barWidth} height={afterHeight} rx="10" fill="url(#refresh-warning-bar-gradient)" />

      <line
        x1={beforeX + barWidth / 2}
        y1={beforeTopY}
        x2={afterX + barWidth / 2}
        y2={afterTopY}
        stroke="url(#refresh-warning-line-gradient)"
        strokeWidth="1.6"
      />
      <circle cx={beforeX + barWidth / 2} cy={beforeTopY} r="4" fill="#D27373" />
      <circle cx={afterX + barWidth / 2} cy={afterTopY} r="4" fill="#D27373" />

      <text x={beforeX + barWidth / 2} y={chartHeight + 30.3} textAnchor="middle" className="refresh-warning-chart-label">
        {formatDuration(before)}
      </text>
      <text
        x={afterX + barWidth / 2}
        y={chartHeight + 30.3}
        textAnchor="middle"
        className="refresh-warning-chart-label is-highlight"
      >
        {formatDuration(after)}
      </text>
      </g>

      <defs>
        <linearGradient id="refresh-warning-bar-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC7C7" />
          <stop offset="100%" stopColor="#EC8181" />
        </linearGradient>
        <linearGradient
          id="refresh-warning-line-gradient"
          gradientUnits="userSpaceOnUse"
          x1={beforeX + barWidth / 2}
          y1={beforeTopY}
          x2={afterX + barWidth / 2}
          y2={afterTopY}
        >
          <stop offset="0%" stopColor="#F18E8E" />
          <stop offset="100%" stopColor="#8B5252" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RefreshTimeWarning() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { payload, check = {} } = location.state ?? {};

  const currentRefreshMinutes = check.currentRefreshMinutes ?? 0;
  const expectedRefreshMinutes = check.expectedRefreshMinutes ?? 0;
  const decreasedMinutes = check.refreshDecreaseMinutes ?? 0;
  const minimumRecommendedMinutes = check.minimumRecommendedRefreshMinutes ?? 0;
  const isBelowMinimum = Boolean(check.belowMinimumRecommended);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterAsIs = async () => {
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    try {
      await createEvent(payload);
      queryClient.invalidateQueries({ queryKey: ['home', 'today'] });
      navigate('/schedule/complete', { state: { payload } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '일정을 등록하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewRecommendation = () => {
    navigate('/schedule/recommend', { state: { payload } });
  };

  return (
    <div className="page refresh-warning-page">
      <div className="refresh-warning-header">
        <button type="button" className="refresh-warning-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <BackIcon />
        </button>
      </div>

      <h1 className="refresh-warning-title">
        앗! 해당 날짜의
        <br />
        <span className="refresh-warning-title-highlight">Refresh Time</span>이
        <br />
        {formatDuration(decreasedMinutes)} 감소했어요.
      </h1>

      <div className="refresh-warning-section">
        <div className="refresh-warning-chart-wrap">
          <RefreshTimeChart before={currentRefreshMinutes} after={expectedRefreshMinutes} />
        </div>

        {isBelowMinimum && (
          <div className="refresh-warning-box">
            <WarningIcon />
            <p>
              최소 권장 Refresh Time({formatDuration(minimumRecommendedMinutes)})을
              <br />
              충족하지 못하고 있어요.
              <br />
              <span>더 건강한 하루를 위해 일정을 다시 배치해 보세요.</span>
            </p>
          </div>
        )}

        {error && <p className="refresh-warning-error">{error}</p>}

        <div className="refresh-warning-actions">
          <button
            type="button"
            className="btn btn-secondary refresh-warning-btn"
            onClick={handleRegisterAsIs}
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '그대로 등록'}
          </button>
          <button type="button" className="btn btn-primary refresh-warning-btn" onClick={handleViewRecommendation}>
            대체 일정 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default RefreshTimeWarning;
