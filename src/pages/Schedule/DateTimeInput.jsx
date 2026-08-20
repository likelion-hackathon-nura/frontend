import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import DatePickerModal from '../../components/DatePickerModal/DatePickerModal';
import TimePickerModal from '../../components/TimePickerModal/TimePickerModal';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as SocialIcon } from '../../assets/images/social_icon.svg';
import { ReactComponent as RefreshIcon } from '../../assets/images/refresh_icon.svg';
import { ReactComponent as MytimeIcon } from '../../assets/images/mytime_icon.svg';
import { checkEvent, createEvent } from '../../api/event';
import { ApiError } from '../../api/client';
import './DateTimeInput.css';

const CATEGORY_META = {
  social: { Icon: SocialIcon, label: 'Social Time', apiValue: 'SOCIAL' },
  refresh: { Icon: RefreshIcon, label: 'Refresh Time', apiValue: 'REFRESH' },
  mytime: { Icon: MytimeIcon, label: 'My Time', apiValue: 'MY' },
};

function pad(n) {
  return String(n).padStart(2, '0');
}

// DatePickerModal은 연도를 고르지 않으므로, 선택한 월/일이 이미 지났으면 다음 해로 본다.
function resolveYear(month, day) {
  const now = new Date();
  const picked = new Date(now.getFullYear(), month - 1, day);
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return picked < todayOnly ? now.getFullYear() + 1 : now.getFullYear();
}

// 종료 시간이 시작 시간보다 빠르거나 같으면 자정을 넘긴 일정으로 보고 다음 날로 넘긴다.
function buildEventPayload({ category, title, date, startTime, endTime }) {
  const year = resolveYear(date.month, date.day);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startAt = new Date(year, date.month - 1, date.day, startHour, startMinute);
  const endAt = new Date(year, date.month - 1, date.day, endHour, endMinute);
  if (endAt <= startAt) endAt.setDate(endAt.getDate() + 1);

  const toIso = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

  return {
    category: CATEGORY_META[category].apiValue,
    eventName: title,
    startAt: toIso(startAt),
    endAt: toIso(endAt),
  };
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="3.5" width="13" height="12" rx="2" stroke="#D27373" strokeWidth="1.4" />
      <path d="M2.5 7H15.5" stroke="#D27373" strokeWidth="1.4" />
      <path d="M6 2V4.5M12 2V4.5" stroke="#D27373" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="6.5" stroke="#D27373" strokeWidth="1.4" />
      <path d="M9 5.5V9L11.5 10.5" stroke="#D27373" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L7 7L1 13" stroke="#C9C2C4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DateTimeInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const category = location.state?.category ?? 'social';
  const meta = CATEGORY_META[category];

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isComplete = Boolean(title && date && startTime && endTime);

  // 추가 버튼 → 가능 여부 확인.
  // AVAILABLE이면 곧바로 등록까지 진행하고, Refresh Time이 줄어들면 경고 화면으로 넘긴다.
  const handleNext = async () => {
    if (isSubmitting) return;
    const payload = buildEventPayload({ category, title, date, startTime, endTime });

    setError('');
    setIsSubmitting(true);
    try {
      const check = await checkEvent(payload);

      if (check.status === 'AVAILABLE') {
        await createEvent(payload);
        queryClient.invalidateQueries({ queryKey: ['home', 'today'] });
        navigate('/schedule/complete', { state: { payload } });
        return;
      }

      navigate('/schedule/warning', { state: { payload, check } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '일정을 추가하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page datetime-input-page">
      <div className="datetime-input-header">
        <button type="button" className="datetime-input-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <span className="datetime-input-progress">2/2</span>
      </div>

      <div className="datetime-input-progress-bar-wrap">
        <div className="datetime-input-progress-bar">
          <div className="datetime-input-progress-bar-fill" />
        </div>
      </div>

      <div className="datetime-input-title-row">
        <h1 className="datetime-input-title">
          추가하실 일정의
          <br />
          날짜와 시간을 입력해 주세요.
        </h1>
        <meta.Icon className="datetime-input-category-icon" />
      </div>

      <div className="datetime-input-section">
        <div className="datetime-input-field">
          <span className="datetime-input-label">일정명</span>
          <div className="datetime-input-text-wrap">
            <CalendarIcon />
            <input
              type="text"
              className="datetime-input-text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="일정명을 입력해 주세요."
            />
          </div>
        </div>

        <div className="datetime-input-field">
          <span className="datetime-input-label">날짜</span>
          <button type="button" className="datetime-input-trigger" onClick={() => setActiveModal('date')}>
            <CalendarIcon />
            <span className={date ? 'datetime-input-value' : 'datetime-input-placeholder'}>
              {date ? `${date.month}월 ${date.day}일` : '날짜를 선택해 주세요.'}
            </span>
            <ChevronRight />
          </button>
        </div>

        <div className="datetime-input-field">
          <span className="datetime-input-label">시작 시간</span>
          <button type="button" className="datetime-input-trigger" onClick={() => setActiveModal('start')}>
            <ClockIcon />
            <span className={startTime ? 'datetime-input-value' : 'datetime-input-placeholder'}>
              {startTime || '시간을 선택해 주세요.'}
            </span>
            <ChevronRight />
          </button>
        </div>

        <div className="datetime-input-field">
          <span className="datetime-input-label">종료 시간</span>
          <button type="button" className="datetime-input-trigger" onClick={() => setActiveModal('end')}>
            <ClockIcon />
            <span className={endTime ? 'datetime-input-value' : 'datetime-input-placeholder'}>
              {endTime || '시간을 선택해 주세요.'}
            </span>
            <ChevronRight />
          </button>
        </div>

        {error && <p className="datetime-input-error">{error}</p>}

        <button
          type="button"
          className="btn btn-primary btn-full datetime-input-next"
          disabled={!isComplete || isSubmitting}
          onClick={handleNext}
        >
          {isSubmitting ? '확인 중...' : '추가'}
        </button>
      </div>

      {activeModal === 'date' && (
        <DatePickerModal value={date} onConfirm={(v) => { setDate(v); setActiveModal(null); }} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'start' && (
        <TimePickerModal
          label="시작 시간"
          value={startTime}
          onConfirm={(v) => { setStartTime(v); setActiveModal(null); }}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'end' && (
        <TimePickerModal
          label="종료 시간"
          value={endTime}
          onConfirm={(v) => { setEndTime(v); setActiveModal(null); }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}

export default DateTimeInput;
