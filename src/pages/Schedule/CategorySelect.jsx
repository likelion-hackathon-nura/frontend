import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as SocialIcon } from '../../assets/images/social_icon.svg';
import { ReactComponent as RefreshIcon } from '../../assets/images/refresh_icon.svg';
import { ReactComponent as MytimeIcon } from '../../assets/images/mytime_icon.svg';
import './CategorySelect.css';

const CATEGORIES = [
  {
    key: 'social',
    Icon: SocialIcon,
    label: 'Social Time',
    description: '근무, 교육, 출퇴근, 확정 약속에 해당돼요.',
    className: 'category-card-social',
  },
  {
    key: 'refresh',
    Icon: RefreshIcon,
    label: 'Refresh Time',
    description: '수면, 식사, 샤워, 피부 회복에 해당돼요.',
    className: 'category-card-refresh',
  },
  {
    key: 'mytime',
    Icon: MytimeIcon,
    label: 'My Time',
    description: '영상, 게임, 독서, 산책, 친구 만남에 해당돼요.',
    className: 'category-card-mytime',
  },
];

function ArrowIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6H13M13 6L8 1M13 6L8 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CategorySelect() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState(null);

  const goToDateTime = (categoryKey) => {
    navigate('/schedule/datetime', { state: { category: categoryKey } });
  };

  const handleNext = () => {
    if (!selectedKey) return;
    goToDateTime(selectedKey);
  };

  return (
    <div className="page category-select-page">
      <div className="category-select-header">
        <button type="button" className="category-select-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <BackIcon />
        </button>
        <span className="category-select-progress">1/2</span>
      </div>

      <div className="category-select-progress-bar-wrap">
        <div className="category-select-progress-bar">
          <div className="category-select-progress-bar-fill" />
        </div>
      </div>

      <h1 className="category-select-title">
        추가하실 일정의
        <br />
        카테고리를 선택해 주세요.
      </h1>

      <div className="category-select-section">
        <div className="category-select-list">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={
                selectedKey === cat.key ? `category-card ${cat.className} is-selected` : `category-card ${cat.className}`
              }
              onClick={() => setSelectedKey(cat.key)}
            >
              <cat.Icon className="category-card-icon" />
              <span className="category-card-text">
                <span className="category-card-label">{cat.label}</span>
                <span className="category-card-desc">{cat.description}</span>
              </span>
              {/* 화살표는 선택을 건너뛰고 곧바로 다음 화면으로 이동한다. */}
              <span
                className="category-card-arrow"
                role="button"
                aria-label={`${cat.label} 선택하고 다음으로`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToDateTime(cat.key);
                }}
              >
                <ArrowIcon />
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn btn-primary category-select-next"
          disabled={!selectedKey}
          onClick={handleNext}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default CategorySelect;
