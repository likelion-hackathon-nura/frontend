import { useState } from 'react';
import { ReactComponent as NightTopIcon } from '../../assets/images/night-today.svg';
import { ReactComponent as SocialIcon } from '../../assets/images/social-time.svg';
import { ReactComponent as RefreshIcon } from '../../assets/images/refresh-time.svg';
import { ReactComponent as MytimeIcon } from '../../assets/images/my-time.svg';
import './Home.css';

const WEEK_DAYS = [
  { label: '월', date: 16, shift: 'N' },
  { label: '화', date: 17, shift: 'OFF' },
  { label: '수', date: 18, shift: 'D' },
  { label: '목', date: 19, shift: 'N' },
  { label: '금', date: 20, shift: 'N', isToday: true },
  { label: '토', date: 21, shift: 'E' },
  { label: '일', date: 22, shift: 'E' },
];

const AI_TAGS = ['🌙 이틀 연속 나이트 근무', '😐 피로도 4점 기록', '🌿 피부 당김', '🚫 회복 모드 연속 미수행'];

function Home() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="page home-page">
      <p className="home-greeting">수정님, 좋은 아침이에요 🌞</p>
      <div className="home-today">
        <h1>오늘은 나이트 근무예요</h1>
        <NightTopIcon className="home-today-icon" />
      </div>

      <div className="home-calendar-card">
        <div className="home-calendar-header">
          <button type="button" className="calendar-nav" aria-label="이전 주">‹</button>
          <span>이번 주</span>
          <button type="button" className="calendar-nav" aria-label="다음 주">›</button>
        </div>
        <div className="home-calendar-days">
          {WEEK_DAYS.map((d) => (
            <div key={d.date} className={d.isToday ? 'calendar-day is-today' : 'calendar-day'}>
              <span className="calendar-day-label">{d.label}</span>
              <span className="calendar-day-date">{d.date}</span>
              <span className={`shift-badge shift-${d.shift}`}>{d.shift}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="home-section-title">오늘의 시간 분배</h2>

      <div className="home-time-card">
        <div className="home-card-dots">
          <span className="dot is-active" />
          <span className="dot" />
        </div>

        <div className="home-ring-wrap">
          <svg className="home-ring-svg" viewBox="0 0 220 220" width="100%" height="100%">
          <g transform="rotate(-72 110 110)">
            {/* base ring (light tint) */}
            <path d="M110,18 A92,92 0 0,1 164.08,184.43" fill="none" stroke="#F7C1C1" strokeWidth="30" />
            <path d="M164.08,184.43 A92,92 0 0,1 18.17,115.78" fill="none" stroke="#AEADC1" strokeWidth="30" />
            <path d="M18.17,115.78 A92,92 0 0,1 110,18" fill="none" stroke="#FAF0DD" strokeWidth="30" />
            {/* tick overlay, same hue at 50% opacity */}
            <path d="M110,18 A92,92 0 0,1 164.08,184.43" fill="none" stroke="#F18E8E" strokeOpacity="0.5" strokeWidth="9" strokeDasharray="2.5 4" />
            <path d="M164.08,184.43 A92,92 0 0,1 18.17,115.78" fill="none" stroke="#6B698E" strokeOpacity="0.5" strokeWidth="9" strokeDasharray="2.5 4" />
            <path d="M18.17,115.78 A92,92 0 0,1 110,18" fill="none" stroke="#F5E3C1" strokeOpacity="0.5" strokeWidth="9" strokeDasharray="2.5 4" />
            {/* boundary gap connectors */}
            <path d="M95.61,19.13 A92,92 0 0,1 124.39,19.13" fill="none" stroke="#E8E8E8" strokeWidth="30" />
            <path d="M175.05,175.05 A92,92 0 0,1 151.77,191.97" fill="none" stroke="#E8E8E8" strokeWidth="30" />
            <path d="M20.20,130.07 A92,92 0 0,1 18.41,101.34" fill="none" stroke="#E8E8E8" strokeWidth="30" />
            {/* boundary beads */}
            <circle cx="95.61" cy="19.13" r="13" fill="#F5E3C1" />
            <circle cx="124.39" cy="19.13" r="13" fill="#F18E8E" />
            <circle cx="175.05" cy="175.05" r="13" fill="#F18E8E" />
            <circle cx="151.77" cy="191.97" r="13" fill="#6B698E" />
            <circle cx="20.20" cy="130.07" r="13" fill="#6B698E" />
            <circle cx="18.41" cy="101.34" r="13" fill="#F5E3C1" />
          </g>
          </svg>
          <div className="home-ring-center">23:48:01</div>
        </div>

        <div className="home-stats">
          <div className="home-stat">
            <SocialIcon className="social-time-icon" />
            <p className="home-stat-label-social">Social Time</p>
            <p className="home-stat-value">7시간 30분</p>
            <span className="home-stat-pill home-stat-pill-social">34%</span>
          </div>
          <div className="home-stat">
            <RefreshIcon className="refresh-time-icon" />
            <p className="home-stat-label-refresh">Refresh Time</p>
            <p className="home-stat-value">4시간 30분</p>
            <span className="home-stat-pill home-stat-pill-refresh">40%</span>
          </div>
          <div className="home-stat">
            <MytimeIcon className="my-time-icon" />
            <p className="home-stat-label-mytime">My Time</p>
            <p className="home-stat-value">12시간</p>
            <span className="home-stat-pill home-stat-pill-mytime">26%</span>
          </div>
        </div>

        <button
          type="button"
          className="home-expand-toggle"
          onClick={() => setAiOpen((open) => !open)}
          aria-label="AI 코멘트 펼치기"
        >
          {aiOpen ? '︿' : '⌄'}
        </button>

        {aiOpen && (
          <div className="home-ai-comment">
            <p className="home-ai-title">✦ AI 코멘트</p>
            <p className="home-ai-body">
              나이트 근무를 이틀 연속 하셔서 회복이 더 필요할 것 같아요. 또한 어제 체크인에서 피로도(4/5)와 피부
              당김을 선택해 회복이 더 필요하다고 판단했어요. 그래서 오늘은 Refresh Time을 평소보다 1시간 30분 더
              확보하고, My Time은 조금 줄여 피부와 수면 회복을 우선하도록 시간을 재설계했어요. 😊
            </p>
            <div className="home-ai-tags">
              {AI_TAGS.map((tag) => (
                <span key={tag} className="home-ai-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button type="button" className="home-fab" aria-label="추가">
        +
      </button>

      <nav className="home-bottom-nav">
        <button type="button" className="home-nav-item is-active">
          <span>🏠</span>
          <span>홈</span>
        </button>
        <button type="button" className="home-nav-item">
          <span>📋</span>
          <span>리포트</span>
        </button>
        <button type="button" className="home-nav-item">
          <span>😊</span>
          <span>피부</span>
        </button>
        <button type="button" className="home-nav-item">
          <span>👤</span>
          <span>마이</span>
        </button>
      </nav>
    </div>
  );
}

export default Home;
