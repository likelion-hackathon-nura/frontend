import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as RankIcon1 } from '../../assets/images/home-ai-1.svg';
import { ReactComponent as RankIcon2 } from '../../assets/images/home-ai-2.svg';
import { ReactComponent as RankIcon3 } from '../../assets/images/home-ai-3.svg';
import { createEvent, getEventRecommendations } from '../../api/event';
import { ApiError } from '../../api/client';
import './AiRecommendation.css';

const RANK_ICONS = {
  1: RankIcon1,
  2: RankIcon2,
  3: RankIcon3,
};

// 응답에 태그 문구가 없어서 추천 유형(type)으로 배지 하나를 만든다.
const TYPE_TAGS = {
  TODAY_MY: '🌙 오늘 개인 시간',
  OFF_DAY: '✅ 근무 없는 날',
  BUFFER_RELAXED: '⏰ 출퇴근 여유시간 사용',
};

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function formatDateLabel(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dayLabel = DAY_LABELS[new Date(year, month - 1, day).getDay()];
  return `${month}월 ${day}일 (${dayLabel})`;
}

function formatTimeRange(startAt, endAt) {
  return `${startAt.slice(11, 16)} - ${endAt.slice(11, 16)}`;
}

function AiRecommendation() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { payload } = location.state ?? {};

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    isPending,
    error: fetchError,
  } = useQuery({
    queryKey: ['events', 'recommendations', payload],
    queryFn: () => getEventRecommendations(payload),
    enabled: Boolean(payload),
    retry: false,
  });

  const recommendations = data?.recommendations ?? [];

  const handleRegister = async () => {
    if (isSubmitting || selectedIndex === null) return;
    const selected = recommendations[selectedIndex];

    setError('');
    setIsSubmitting(true);
    try {
      await createEvent({ ...payload, startAt: selected.startAt, endAt: selected.endAt });
      queryClient.invalidateQueries({ queryKey: ['home', 'today'] });
      navigate('/schedule/complete', { state: { payload } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '일정을 등록하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
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
        {isPending && <p className="ai-recommendation-empty">추천 일정을 불러오고 있어요...</p>}

        {fetchError && <p className="ai-recommendation-empty">추천 일정을 불러오지 못했어요.</p>}

        {!isPending && !fetchError && recommendations.length === 0 && (
          <p className="ai-recommendation-empty">추천할 수 있는 시간대가 없어요.</p>
        )}

        {recommendations.length > 0 && (
          <div className="ai-recommendation-list">
            {recommendations.map((rec, index) => {
              const RankIcon = RANK_ICONS[index + 1];
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={`${rec.date}-${rec.startAt}`}
                  type="button"
                  className={isSelected ? 'ai-recommendation-card is-selected' : 'ai-recommendation-card'}
                  onClick={() => setSelectedIndex(index)}
                >
                  <span className={isSelected ? 'ai-recommendation-radio is-checked' : 'ai-recommendation-radio'} />
                  {RankIcon && <RankIcon className="ai-recommendation-medal" />}

                  <span className="ai-recommendation-content">
                    <span className="ai-recommendation-datetime">
                      <span className="ai-recommendation-date">{formatDateLabel(rec.date)}</span>
                      <span className="ai-recommendation-time">{formatTimeRange(rec.startAt, rec.endAt)}</span>
                    </span>

                    <span className="ai-recommendation-reason">{rec.description}</span>

                    <span className="ai-recommendation-tags">
                      <span className="ai-recommendation-tag">{TYPE_TAGS[rec.type] ?? rec.type}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {error && <p className="ai-recommendation-error">{error}</p>}

        <button
          type="button"
          className="btn btn-primary btn-full ai-recommendation-submit"
          onClick={handleRegister}
          disabled={selectedIndex === null || isSubmitting}
        >
          {isSubmitting ? '등록 중...' : '등록하기'}
        </button>
      </div>
    </div>
  );
}

export default AiRecommendation;
