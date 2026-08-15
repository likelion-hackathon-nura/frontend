import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as SleepIcon } from '../../assets/images/sleep.svg';
import { ReactComponent as ShowerIcon } from '../../assets/images/shower.svg';
import { ReactComponent as StudyIcon } from '../../assets/images/study.svg';
import { ReactComponent as ExerciseIcon } from '../../assets/images/exercise.svg';
import { ReactComponent as AnimalsIcon } from '../../assets/images/animals.svg';
import { ReactComponent as WalkingIcon } from '../../assets/images/walking.svg';
import { ReactComponent as YogaIcon } from '../../assets/images/yoga.svg';
import { ReactComponent as EtcIcon } from '../../assets/images/etc.svg';
import { useOnboarding, REST_ACTIVITY_MAP } from './OnboardingContext';
import './Step3Activity.css';

const ACTIVITIES = [
  { key: 'sleep', Icon: SleepIcon, label: '낮잠/수면' },
  { key: 'shower', Icon: ShowerIcon, label: '목욕/반신욕' },
  { key: 'study', Icon: StudyIcon, label: '독서/공부' },
  { key: 'exercise', Icon: ExerciseIcon, label: '운동/스트레칭' },
  { key: 'animals', Icon: AnimalsIcon, label: '반려동물 케어' },
  { key: 'walking', Icon: WalkingIcon, label: '산책/카페' },
  { key: 'yoga', Icon: YogaIcon, label: '명상/요가' },
  { key: 'etc', Icon: EtcIcon, label: '기타' },
];

function Step3Activity() {
  const navigate = useNavigate();
  const { updateOnboarding } = useOnboarding();
  const [selected, setSelected] = useState([]);

  const toggle = (key) => {
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= 3) return prev;
      return [...prev, key];
    });
  };

  const handleNext = () => {
    updateOnboarding({ restActivities: selected.map((key) => REST_ACTIVITY_MAP[key]) });
    navigate('/onboarding/step4');
  };

  return (
    <div className="page step3-page">
      <div className="step3-header">
        <button type="button" className="step3-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <span className="step3-progress">3/4</span>
      </div>

      <div className="step3-progress-bar-wrap">
        <div className="step3-progress-bar">
          <div className="step3-progress-bar-fill" />
        </div>
      </div>

      <h1 className="step3-title">
        주로 어떤 활동을 하며
        <br />
        쉬는 시간을 보내나요?
      </h1>
      <p className="step3-subtitle">나에게 딱 맞춘 회복 시간을 계산해 드려요.</p>

      <div className="step3-card-wrap">
        <div className="step3-card">
          <p className="step3-hint">1~3개 선택 (필수)</p>

          <div className="step3-grid">
            {ACTIVITIES.map((item) => (
              <button
                type="button"
                key={item.key}
                className={
                  selected.includes(item.key) ? 'step3-item is-selected' : 'step3-item'
                }
                onClick={() => toggle(item.key)}
              >
                <item.Icon className="step3-item-icon" />
                <span className="step3-item-label">{item.label}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-full step3-next"
            onClick={handleNext}
            disabled={selected.length === 0}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step3Activity;
