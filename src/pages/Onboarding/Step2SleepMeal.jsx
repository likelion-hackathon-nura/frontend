import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as RegularIcon } from '../../assets/images/regular.svg';
import { ReactComponent as SometimesSkipIcon } from '../../assets/images/sometimes-skip.svg';
import { ReactComponent as OftenSkipIcon } from '../../assets/images/often-skip.svg';
import './Step2SleepMeal.css';

const SLEEP_MIN = 4;
const SLEEP_MAX = 10;

const MEAL_OPTIONS = [
  {
    key: 'regular',
    Icon: RegularIcon,
    title: '규칙적으로 식사해요',
    description: '거의 매일 3끼를 챙겨 먹어요.',
  },
  {
    key: 'sometimes-skip',
    Icon: SometimesSkipIcon,
    title: '가끔 거르기도 해요.',
    description: '바쁘면 한 끼를 거르기도 해요.',
  },
  {
    key: 'often-skip',
    Icon: OftenSkipIcon,
    title: '자주 거르는 편이에요.',
    description: '불규칙하거나 거르는 날이 많아요.',
  },
];

function Step2SleepMeal() {
  const navigate = useNavigate();
  const [sleepHours, setSleepHours] = useState(7);
  const [mealPattern, setMealPattern] = useState(null);

  const percent = ((sleepHours - SLEEP_MIN) / (SLEEP_MAX - SLEEP_MIN)) * 100;

  return (
    <div className="page step2-page">
      <div className="step2-header">
        <button type="button" className="step2-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <span className="step2-progress">2/4</span>
      </div>

      <div className="step2-progress-bar-wrap">
        <div className="step2-progress-bar">
          <div className="step2-progress-bar-fill" />
        </div>
      </div>

      <h1 className="step2-title">
        목표 수면 시간을
        <br />
        입력해 주세요.
      </h1>
      <p className="step2-subtitle">회복을 위한 최소 수면 시간을 기준으로 설계해 드려요.</p>

      <div className="step2-card-wrap">
        <div className="step2-card">
          <div className="step2-sleep-card">
            <p className="step2-sleep-label">하루 최소 목표 수면 시간</p>

            <div className="step2-sleep-value">
              <span className="step2-sleep-number">{sleepHours}</span>
              <span className="step2-sleep-unit">시간</span>
              <span className="step2-sleep-number">00</span>
              <span className="step2-sleep-unit">분</span>
            </div>

            <div className="step2-slider-wrap">
              <div className="step2-slider-track">
                <div className="step2-slider-fill" style={{ width: `${percent}%` }} />
              </div>

              <div className="step2-slider-dots">
                {Array.from({ length: SLEEP_MAX - SLEEP_MIN + 1 }, (_, i) => SLEEP_MIN + i).map((n) => (
                  <span
                    key={n}
                    className={n <= sleepHours ? 'step2-slider-dot is-filled' : 'step2-slider-dot'}
                    style={{ left: `${((n - SLEEP_MIN) / (SLEEP_MAX - SLEEP_MIN)) * 100}%` }}
                  />
                ))}
              </div>

              <div className="step2-slider-thumb" style={{ left: `${percent}%` }}>
                <span>‹</span>
                <span>›</span>
              </div>

              <input
                type="range"
                min={SLEEP_MIN}
                max={SLEEP_MAX}
                step={1}
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="step2-slider"
              />
            </div>

            <div className="step2-slider-ticks">
              {Array.from({ length: SLEEP_MAX - SLEEP_MIN + 1 }, (_, i) => SLEEP_MIN + i).map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>

          <div className="step2-meal-section">
            <h2 className="step2-meal-title">
              식사 패턴 <span className="step2-meal-required">(선택)</span>
            </h2>
            <p className="step2-meal-subtitle">평소 식사 패턴에 가장 가까운 것을 선택해 주세요.</p>

            <div className="step2-meal-list">
              {MEAL_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.key}
                  className={
                    mealPattern === option.key ? 'step2-meal-option is-selected' : 'step2-meal-option'
                  }
                  onClick={() => setMealPattern(option.key)}
                >
                  <option.Icon className="step2-meal-emoji" />
                  <span className="step2-meal-text">
                    <span className="step2-meal-option-title">{option.title}</span>
                    <span className="step2-meal-option-desc">{option.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-full step2-next"
            onClick={() => navigate('/onboarding/step3')}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step2SleepMeal;
