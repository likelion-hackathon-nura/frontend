import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TimePickerModal from '../../components/TimePickerModal/TimePickerModal';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as DayIcon } from '../../assets/images/day.svg';
import { ReactComponent as EveningIcon } from '../../assets/images/evening.svg';
import { ReactComponent as NightIcon } from '../../assets/images/night.svg';
import './Step1WorkSchedule.css';

const SHIFTS = [
  { key: 'day', Icon: DayIcon, label: 'Day 근무' },
  { key: 'evening', Icon: EveningIcon, label: 'Evening 근무' },
  { key: 'night', Icon: NightIcon, label: 'Night 근무' },
];

function ChevronDown() {
  return (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L5 5L9 1" stroke="#7B7578" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Step1WorkSchedule() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState({
    day: { checkIn: '07:00', checkOut: '15:30' },
    evening: { checkIn: '13:00', checkOut: '23:30' },
    night: { checkIn: '21:00', checkOut: '07:00' },
  });
  const [activeField, setActiveField] = useState(null);

  const handleConfirm = (value) => {
    setSchedule((prev) => ({
      ...prev,
      [activeField.shift]: {
        ...prev[activeField.shift],
        [activeField.type]: value,
      },
    }));
    setActiveField(null);
  };

  return (
    <div className="page step1-page">
      <div className="step1-header">
        <button type="button" className="step1-back" onClick={() => navigate('/')} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <span className="step1-progress">1/4</span>
      </div>

      <div className="step1-progress-bar-wrap">
        <div className="step1-progress-bar">
          <div className="step1-progress-bar-fill" />
        </div>
      </div>

      <h1 className="step1-title">
        나만의 회복 루틴 설정,
        <br />
        4단계면 끝나요.
      </h1>
      <p className="step1-subtitle">출퇴근 시간을 입력해 주세요.</p>

      <div className="step1-card-wrap">
      <div className="step1-card">
        {SHIFTS.map((shift) => (
          <div className="step1-shift" key={shift.key}>
            <div className="step1-shift-label">
              <shift.Icon className="step1-shift-emoji" />
              <span>{shift.label}</span>
            </div>

            <div className="step1-time-row">
              <div className="step1-time-field">
                <span className="step1-time-label">출근 시간</span>
                <button
                  type="button"
                  className="step1-time-trigger"
                  onClick={() => setActiveField({ shift: shift.key, type: 'checkIn' })}
                >
                  <span>{schedule[shift.key].checkIn}</span>
                  <ChevronDown />
                </button>
              </div>

              <div className="step1-time-field">
                <span className="step1-time-label">퇴근 시간</span>
                <button
                  type="button"
                  className="step1-time-trigger"
                  onClick={() => setActiveField({ shift: shift.key, type: 'checkOut' })}
                >
                  <span>{schedule[shift.key].checkOut}</span>
                  <ChevronDown />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary btn-full step1-next"
          onClick={() => navigate('/onboarding/step2')}
        >
          다음
        </button>
      </div>
      </div>

      {activeField && (
        <TimePickerModal
          label={activeField.type === 'checkIn' ? '출근 시간' : '퇴근 시간'}
          value={schedule[activeField.shift][activeField.type]}
          onConfirm={handleConfirm}
          onClose={() => setActiveField(null)}
        />
      )}
    </div>
  );
}

export default Step1WorkSchedule;
