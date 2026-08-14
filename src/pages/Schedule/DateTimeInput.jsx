import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePickerModal from '../../components/DatePickerModal/DatePickerModal';
import TimePickerModal from '../../components/TimePickerModal/TimePickerModal';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as SocialIcon } from '../../assets/images/social_icon.svg';
import { ReactComponent as RefreshIcon } from '../../assets/images/refresh_icon.svg';
import { ReactComponent as MytimeIcon } from '../../assets/images/mytime_icon.svg';
import './DateTimeInput.css';

const CATEGORY_META = {
  social: { Icon: SocialIcon, label: 'Social Time' },
  refresh: { Icon: RefreshIcon, label: 'Refresh Time' },
  mytime: { Icon: MytimeIcon, label: 'My Time' },
};

// Mock Refresh Time impact: a fixed daily baseline minus the new schedule's
// duration when it's not itself a Refresh Time entry (no backend yet).
const REFRESH_BASELINE_MINUTES = 270; // 4시간 30분
const REFRESH_MIN_RECOMMENDED_MINUTES = 240; // 4시간

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

function minutesOfDuration(start, end) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  let endMinutes = eh * 60 + em;
  if (endMinutes <= startMinutes) endMinutes += 24 * 60;
  return endMinutes - startMinutes;
}

function DateTimeInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category ?? 'social';
  const meta = CATEGORY_META[category];

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const isComplete = Boolean(title && date && startTime && endTime);

  const handleNext = () => {
    const durationMinutes = minutesOfDuration(startTime, endTime);
    const projectedRefreshMinutes = Math.max(REFRESH_BASELINE_MINUTES - durationMinutes, 0);

    const scheduleState = { category, title, date, startTime, endTime, projectedRefreshMinutes };

    if (projectedRefreshMinutes < REFRESH_MIN_RECOMMENDED_MINUTES) {
      navigate('/schedule/warning', { state: scheduleState });
    } else {
      navigate('/schedule/complete', { state: scheduleState });
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

        <button
          type="button"
          className="btn btn-primary btn-full datetime-input-next"
          disabled={!isComplete}
          onClick={handleNext}
        >
          추가
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
