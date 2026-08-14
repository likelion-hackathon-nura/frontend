import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as RankIcon1 } from '../../assets/images/home-ai-1.svg';
import { ReactComponent as RankIcon2 } from '../../assets/images/home-ai-2.svg';
import { ReactComponent as RankIcon3 } from '../../assets/images/home-ai-3.svg';
import './AiRecommendation.css';

const RANK_ICONS = {
  1: RankIcon1,
  2: RankIcon2,
  3: RankIcon3,
};

const RECOMMENDATIONS = [
  {
    key: 'mon',
    rank: 1,
    date: '6월 23일 (월)',
    reason: 'DAY 근무 다음날이라\n회복 시간이 여유 있어요.',
    refreshHours: 4,
    refreshMinutes: 40,
    tags: ['😐 회복 시간 확보', '📋 일정 충돌 없음'],
  },
  {
    key: 'wed',
    rank: 2,
    date: '6월 25일 (수)',
    reason: '식사 시간을 유지하면서\n회복 시간을 확보해요.',
    refreshHours: 4,
    refreshMinutes: 20,
    tags: ['🍚 식사 시간 유지', '📋 My Time 조정'],
  },
  {
    key: 'sat',
    rank: 3,
    date: '6월 28일 (토)',
    reason: '휴무 다음날이라\n컨디션 회복에 좋아요.',
    refreshHours: 4,
    refreshMinutes: 10,
    tags: ['✅ 휴무 다음날', '💧 피부 회복 도움'],
  },
];

function AiRecommendation() {
  const navigate = useNavigate();
  const location = useLocation();
  const scheduleState = location.state ?? {};
  const [selectedKey, setSelectedKey] = useState(RECOMMENDATIONS[0].key);

  const handleRegister = () => {
    const selected = RECOMMENDATIONS.find((r) => r.key === selectedKey);
    navigate('/schedule/complete', { state: { ...scheduleState, recommendation: selected } });
  };

  return (
    <div className="page ai-recommendation-page">
      <div className="ai-recommendation-header">
        <button type="button" className="ai-recommendation-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <BackIcon />
        </button>
      </div>

      <h1 className="ai-recommendation-title">AI 추천 일정</h1>
      <p className="ai-recommendation-subtitle">내용을 확인한 뒤 필요한 부분을 수정해 주세요.</p>

      <div className="ai-recommendation-section">
        <div className="ai-recommendation-list">
          {RECOMMENDATIONS.map((rec) => {
            const RankIcon = RANK_ICONS[rec.rank];
            return (
              <button
                key={rec.key}
                type="button"
                className={selectedKey === rec.key ? 'ai-recommendation-card is-selected' : 'ai-recommendation-card'}
                onClick={() => setSelectedKey(rec.key)}
              >
                <span className={selectedKey === rec.key ? 'ai-recommendation-radio is-checked' : 'ai-recommendation-radio'} />
                <RankIcon className="ai-recommendation-medal" />

                <span className="ai-recommendation-content">
                  <span className="ai-recommendation-main">
                    <span className="ai-recommendation-left">
                      <span className="ai-recommendation-date">{rec.date}</span>
                      <span className="ai-recommendation-reason">{rec.reason}</span>
                    </span>

                    <span className="ai-recommendation-divider" />

                    <span className="ai-recommendation-right">
                      <span className="ai-recommendation-refresh-label">예상 Refresh Time</span>
                      <span className="ai-recommendation-refresh-value">
                        <strong>{rec.refreshHours}</strong>
                        <span className="ai-recommendation-refresh-unit">시간</span>{' '}
                        <strong>{rec.refreshMinutes}</strong>
                        <span className="ai-recommendation-refresh-unit">분</span>
                      </span>
                    </span>
                  </span>

                  <span className="ai-recommendation-tags">
                    {rec.tags.map((tag) => (
                      <span key={tag} className="ai-recommendation-tag">
                        {tag}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button type="button" className="btn btn-primary btn-full ai-recommendation-submit" onClick={handleRegister}>
          등록하기
        </button>
      </div>
    </div>
  );
}

export default AiRecommendation;
