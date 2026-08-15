import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as Stage1Icon } from '../../assets/images/stage-1.svg';
import { ReactComponent as Stage2Icon } from '../../assets/images/stage-2.svg';
import { ReactComponent as Stage3Icon } from '../../assets/images/stage-3.svg';
import { useOnboarding, SENSITIVITY_MAP, SKIN_TYPE_MAP, SKIN_CONCERN_MAP } from './OnboardingContext';
import { submitOnboarding } from '../../api/auth';
import { ApiError } from '../../api/client';
import './Step4SkinInfo.css';

const SENSITIVITY_LEVELS = [
  { key: '1', Icon: Stage1Icon, label: '1단계', description: '기본 관리만 해도 괜찮아요.' },
  { key: '2', Icon: Stage2Icon, label: '2단계', description: '적당히 신경 쓰며 관리하고 싶어요.' },
  { key: '3', Icon: Stage3Icon, label: '3단계', description: '최대한 꼼꼼하게 관리하고 싶어요.' },
];

const SKIN_TYPES = [
  { key: 'dry', label: '건성' },
  { key: 'oily', label: '지성' },
  { key: 'combination', label: '복합성' },
  { key: 'sensitive', label: '민감성' },
];

const SKIN_CONCERNS = [
  { key: 'dryness', label: '건조함' },
  { key: 'redness', label: '붉은기' },
  { key: 'trouble', label: '트러블' },
  { key: 'barrier', label: '피부장벽' },
  { key: 'texture', label: '각질/거칠음' },
  { key: 'sebum', label: '피지/유분기' },
  { key: 'wrinkle', label: '주름' },
  { key: 'etc', label: '기타' },
];

const MAX_CONCERNS = 3;

function Step4SkinInfo() {
  const navigate = useNavigate();
  const { data, updateOnboarding } = useOnboarding();
  const [sensitivity, setSensitivity] = useState(null);
  const [skinType, setSkinType] = useState(null);
  const [concerns, setConcerns] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleConcern = (key) => {
    setConcerns((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      }
      if (prev.length >= MAX_CONCERNS) {
        return prev;
      }
      return [...prev, key];
    });
  };

  const handleNext = async () => {
    if (isSubmitting) return;

    const payload = {
      ...data,
      sensitivityLevel: sensitivity ? SENSITIVITY_MAP[sensitivity] : null,
      skinType: skinType ? SKIN_TYPE_MAP[skinType] : null,
      skinConcerns: concerns.map((key) => SKIN_CONCERN_MAP[key]),
    };
    updateOnboarding(payload);

    setError('');
    setIsSubmitting(true);
    try {
      await submitOnboarding(payload);
      navigate('/onboarding/complete');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '온보딩 저장에 실패했어요. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page step4-page">
      <div className="step4-header">
        <button type="button" className="step4-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <span className="step4-progress">4/4</span>
      </div>

      <div className="step4-progress-bar-wrap">
        <div className="step4-progress-bar">
          <div className="step4-progress-bar-fill" />
        </div>
      </div>

      <h1 className="step4-title">
        마지막 단계예요!
        <br />
        나의 피부 정보를 입력해 주세요.
      </h1>
      <p className="step4-subtitle">더 정확한 피부 회복 루틴을 추천해 드릴게요.</p>

      <div className="step4-card-wrap">
        <div className="step4-card">
          <h2 className="step4-section-title">피부 관리 민감도</h2>
          <div className="step4-sensitivity-list">
            {SENSITIVITY_LEVELS.map((level) => (
              <button
                type="button"
                key={level.key}
                className={
                  sensitivity === level.key
                    ? 'step4-sensitivity-item is-selected'
                    : 'step4-sensitivity-item'
                }
                onClick={() => setSensitivity(level.key)}
              >
                <level.Icon className="step4-sensitivity-emoji" />
                <span className="step4-sensitivity-label">{level.label}</span>
                <span className="step4-sensitivity-desc">{level.description}</span>
              </button>
            ))}
          </div>

          <h2 className="step4-section-title">피부 타입</h2>
          <div className="step4-grid">
            {SKIN_TYPES.map((type) => (
              <button
                type="button"
                key={type.key}
                className={
                  skinType === type.key ? 'step4-option is-selected' : 'step4-option'
                }
                onClick={() => setSkinType(type.key)}
              >
                <span className="step4-option-label">{type.label}</span>
                <span className="step4-radio" />
              </button>
            ))}
          </div>

          <h2 className="step4-section-title step4-section-title-concerns">
            피부 고민 <span className="step4-section-hint">(1~3개 선택, 필수)</span>
          </h2>
          <div className="step4-grid">
            {SKIN_CONCERNS.map((concern) => (
              <button
                type="button"
                key={concern.key}
                className={
                  concerns.includes(concern.key) ? 'step4-option is-selected' : 'step4-option'
                }
                onClick={() => toggleConcern(concern.key)}
              >
                <span className="step4-option-label">{concern.label}</span>
                <span className="step4-radio" />
              </button>
            ))}
          </div>

          {error && <p className="step4-error">{error}</p>}

          <button
            type="button"
            className="btn btn-primary btn-full step4-next"
            onClick={handleNext}
            disabled={isSubmitting || !sensitivity || !skinType || concerns.length === 0}
          >
            {isSubmitting ? '저장 중...' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step4SkinInfo;
