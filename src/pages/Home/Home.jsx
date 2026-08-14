import { useRef, useState } from 'react';
import BottomNav from '../../components/BottomNav/BottomNav';
import { ReactComponent as NightTopIcon } from '../../assets/images/night-today.svg';
import { ReactComponent as SocialIcon } from '../../assets/images/social-time.svg';
import { ReactComponent as RefreshIcon } from '../../assets/images/refresh-time.svg';
import { ReactComponent as MytimeIcon } from '../../assets/images/my-time.svg';
import { ReactComponent as AlarmIcon } from '../../assets/images/alarm.svg';
import { ReactComponent as AlarmPushIcon } from '../../assets/images/alarm-push.svg';
import { ReactComponent as HomeDayIcon } from '../../assets/images/home_day.svg';
import { ReactComponent as HomeEveningIcon } from '../../assets/images/home_evening.svg';
import { ReactComponent as HomeNightIcon } from '../../assets/images/home_night.svg';
import { ReactComponent as HomeOffIcon } from '../../assets/images/home_off.svg';
import { ReactComponent as HomeBackIcon } from '../../assets/images/home-back.svg';
import { ReactComponent as HomeNextIcon } from '../../assets/images/home-next.svg';
import { ReactComponent as AiCommentIcon } from '../../assets/images/ai-coment.svg';
import './Home.css';

const SHIFT_ICONS = {
  D: HomeDayIcon,
  E: HomeEveningIcon,
  N: HomeNightIcon,
  OFF: HomeOffIcon,
};

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

const TIME_ENTRIES = [
  {
    key: 'social',
    label: 'Social Time',
    Icon: SocialIcon,
    iconClass: 'social-time-icon',
    entries: [{ time: '21:00 ~ 07:00', tag: '나이트 근무' }],
  },
  {
    key: 'refresh',
    label: 'Refresh Time',
    Icon: RefreshIcon,
    iconClass: 'refresh-time-icon',
    entries: [
      { time: '21:00 ~ 07:00', tag: '피부 관리 | 식사' },
      { time: '21:00 ~ 07:00', tag: '스트레칭 | 식사' },
      { time: '21:00 ~ 07:00', tag: '피부 관리' },
    ],
  },
  {
    key: 'mytime',
    label: 'My Time',
    Icon: MytimeIcon,
    iconClass: 'my-time-icon',
    entries: [
      { time: '21:00 ~ 07:00', tag: '내가 추가한 일정' },
      { time: '21:00 ~ 07:00', tag: '영상 시청 | 게임' },
    ],
  },
];

function RingArcs() {
  return (
    <g transform="rotate(-72 125 125)">
      {/* base ring (light tint) */}
      <path d="M125,15.5 A109.5,109.5 0 0,1 189.36,213.59" fill="none" stroke="#F7C1C1" strokeWidth="30" strokeLinecap="round" />
      <path d="M189.36,213.59 A109.5,109.5 0 0,1 15.70,131.88" fill="none" stroke="#AEADC1" strokeWidth="30" strokeLinecap="round" />
      <path d="M15.70,131.88 A109.5,109.5 0 0,1 125,15.5" fill="none" stroke="#FAF0DD" strokeWidth="30" strokeLinecap="round" />
      {/* tick overlay, same hue at 50% opacity */}
      <path d="M125,15.5 A109.5,109.5 0 0,1 189.36,213.59" fill="none" stroke="#F18E8E" strokeOpacity="0.5" strokeWidth="9" strokeDasharray="2.5 4" />
      <path d="M189.36,213.59 A109.5,109.5 0 0,1 15.70,131.88" fill="none" stroke="#6B698E" strokeOpacity="0.5" strokeWidth="9" strokeDasharray="2.5 4" />
      <path d="M15.70,131.88 A109.5,109.5 0 0,1 125,15.5" fill="none" stroke="#F5E3C1" strokeOpacity="0.5" strokeWidth="9" strokeDasharray="2.5 4" />
      {/* boundary gap connectors */}
      <path d="M107.87,16.85 A109.5,109.5 0 0,1 142.13,16.85" fill="none" stroke="#E8E8E8" strokeWidth="30" />
      <path d="M202.43,202.43 A109.5,109.5 0 0,1 174.71,222.57" fill="none" stroke="#E8E8E8" strokeWidth="30" />
      <path d="M18.11,148.89 A109.5,109.5 0 0,1 15.99,114.69" fill="none" stroke="#E8E8E8" strokeWidth="30" />
      {/* boundary beads */}
      <circle cx="107.87" cy="16.85" r="15" fill="#F5E3C1" />
      <circle cx="142.13" cy="16.85" r="15" fill="#F18E8E" />
      <circle cx="202.43" cy="202.43" r="15" fill="#F18E8E" />
      <circle cx="174.71" cy="222.57" r="15" fill="#6B698E" />
      <circle cx="18.11" cy="148.89" r="15" fill="#6B698E" />
      <circle cx="15.99" cy="114.69" r="15" fill="#F5E3C1" />
    </g>
  );
}

// My Time tab ring: built clockwise from 12 o'clock, split per category entry
// count so Refresh Time (3 entries) and My Time (2 entries) render as separate
// touching arcs instead of one solid arc each, interleaved pink/yellow/purple
// instead of grouped by category. Used only on the My Time page.
const MYTIME_RING_CX = 125;
const MYTIME_RING_CY = 125;
const MYTIME_RING_R = 109.5;
const MYTIME_RING_GAP_DEG = 18;

const MYTIME_RING_CATEGORIES = {
  refresh: { percent: 40, count: 3, base: '#F7C1C1', tick: '#F18E8E' },
  mytime: { percent: 26, count: 2, base: '#FAF0DD', tick: '#F5E3C1' },
  social: { percent: 34, count: 1, base: '#AEADC1', tick: '#6B698E' },
};

// Clockwise color order: pink, yellow, pink, yellow, pink, purple.
const MYTIME_SEGMENT_ORDER = ['refresh', 'mytime', 'refresh', 'mytime', 'refresh', 'social'];

function buildMyTimeRingSegments() {
  const totalCount = MYTIME_SEGMENT_ORDER.length;
  const usableDeg = 360 - MYTIME_RING_GAP_DEG * totalCount;
  const catCounters = {};

  const segments = [];
  let angle = 0;
  MYTIME_SEGMENT_ORDER.forEach((key) => {
    const cat = MYTIME_RING_CATEGORIES[key];
    const idx = catCounters[key] || 0;
    catCounters[key] = idx + 1;
    const subDeg = ((cat.percent / 100) * usableDeg) / cat.count;
    const start = angle;
    const end = angle + subDeg;
    segments.push({ key: `${key}-${idx}`, category: key, start, end, base: cat.base, tick: cat.tick });
    angle = end + MYTIME_RING_GAP_DEG;
  });
  return segments;
}

const MYTIME_RING_SEGMENTS = buildMyTimeRingSegments();

// One gray connector per boundary between segments (wraps from the last segment back to the first).
const MYTIME_RING_GAPS = MYTIME_RING_SEGMENTS.map((seg, i) => {
  const next = MYTIME_RING_SEGMENTS[(i + 1) % MYTIME_RING_SEGMENTS.length];
  const to = i === MYTIME_RING_SEGMENTS.length - 1 ? 360 : next.start;
  return { key: `gap-${i}`, from: seg.end, to };
});

function myTimeRingPoint(angleDeg, r = MYTIME_RING_R) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: MYTIME_RING_CX + r * Math.sin(rad), y: MYTIME_RING_CY - r * Math.cos(rad) };
}

function myTimeRingArcPath(startAngle, endAngle, r = MYTIME_RING_R) {
  const start = myTimeRingPoint(startAngle, r);
  const end = myTimeRingPoint(endAngle, r);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)},${start.y.toFixed(2)} A ${r},${r} 0 ${largeArc},1 ${end.x.toFixed(2)},${end.y.toFixed(2)}`;
}

function myTimeRingNeedlePoint(segmentKey, r) {
  const seg = MYTIME_RING_SEGMENTS.find((s) => s.key === segmentKey);
  const midAngle = (seg.start + seg.end) / 2;
  return myTimeRingPoint(midAngle, r);
}

function MyTimeRingArcs() {
  return (
    <g>
      {MYTIME_RING_SEGMENTS.map((seg) => (
        <path key={seg.key} d={myTimeRingArcPath(seg.start, seg.end)} fill="none" stroke={seg.base} strokeWidth="30" strokeLinecap="round" />
      ))}
      {MYTIME_RING_SEGMENTS.map((seg) => (
        <path
          key={`${seg.key}-tick`}
          d={myTimeRingArcPath(seg.start, seg.end)}
          fill="none"
          stroke={seg.tick}
          strokeOpacity="0.5"
          strokeWidth="9"
          strokeDasharray="2.5 4"
        />
      ))}
      {MYTIME_RING_GAPS.map((gap) => (
        <path key={gap.key} d={myTimeRingArcPath(gap.from, gap.to)} fill="none" stroke="#E8E8E8" strokeWidth="30" />
      ))}
      {MYTIME_RING_SEGMENTS.map((seg) => {
        const startPt = myTimeRingPoint(seg.start);
        const endPt = myTimeRingPoint(seg.end);
        return (
          <g key={`${seg.key}-beads`}>
            <circle cx={startPt.x} cy={startPt.y} r="15" fill={seg.tick} />
            <circle cx={endPt.x} cy={endPt.y} r="15" fill={seg.tick} />
          </g>
        );
      })}
    </g>
  );
}

function Home() {
  const [aiOpen, setAiOpen] = useState(false);
  const [hasAlarm, setHasAlarm] = useState(true);
  const [page, setPage] = useState(0);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 40) setPage(0);
    else if (deltaX < -40) setPage(1);
    touchStartX.current = null;
  };

  return (
    <div className="page home-page">
      <button
        type="button"
        className="home-alarm-btn"
        onClick={() => setHasAlarm(false)}
        aria-label="알림"
      >
        {hasAlarm ? <AlarmPushIcon /> : <AlarmIcon />}
      </button>

      <p className="home-greeting">수정님, 좋은 아침이에요 🌞</p>
      <div className="home-today">
        <h1>오늘은 나이트 근무예요</h1>
        <NightTopIcon className="home-today-icon" />
      </div>

      <div className="home-calendar-card">
        <div className="home-calendar-header">
          <button type="button" className="calendar-nav" aria-label="이전 주">
            <HomeBackIcon />
          </button>
          <span>이번 주</span>
          <button type="button" className="calendar-nav" aria-label="다음 주">
            <HomeNextIcon />
          </button>
        </div>
        <div className="home-calendar-days">
          {WEEK_DAYS.map((d) => {
            const ShiftIcon = SHIFT_ICONS[d.shift];
            return (
            <div key={d.date} className={d.isToday ? 'calendar-day is-today' : 'calendar-day'}>
              <span className="calendar-day-label">{d.label}</span>
              <span className="calendar-day-date">{d.date}</span>
              <ShiftIcon className="calendar-day-shift-icon" />
            </div>
            );
          })}
        </div>
      </div>

      <h2 className="home-section-title">오늘의 시간 분배</h2>

      <div className="home-time-card" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div className="home-card-dots">
          <span
            role="button"
            tabIndex={0}
            className={page === 0 ? 'dot is-active' : 'dot'}
            onClick={() => setPage(0)}
          />
          <span
            role="button"
            tabIndex={0}
            className={page === 1 ? 'dot is-active' : 'dot'}
            onClick={() => setPage(1)}
          />
        </div>

        {page === 0 && (
          <>
            <div className="home-ring-wrap">
              <svg className="home-ring-svg" viewBox="0 0 250 250" width="100%" height="100%">
                <RingArcs />
                <circle cx="125" cy="125" r="84.5" fill="#FFEDED" stroke="#FFE0D6" strokeWidth="1" />
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

            {!aiOpen && (
              <button
                type="button"
                className="home-expand-toggle"
                onClick={() => setAiOpen(true)}
                aria-label="AI 코멘트 펼치기"
              >
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                  <path d="M1 1L8 8L15 1" stroke="#A89EA1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {aiOpen && (
              <div className="home-ai-comment">
                <p className="home-ai-title">
                  <AiCommentIcon className="home-ai-title-icon" /> AI 코멘트
                </p>
                <p className="home-ai-body">
                  나이트 근무를 이틀 연속 하셔서 회복이 더 필요할 것 같아요.
                  <br />
                  또한 어제 체크인에서 피로도(4/5)와 피부 당김을 선택해 회복이 더 필요하다고 판단했어요.
                  <br />
                  그래서 오늘은 <strong>Refresh Time을 평소보다 1시간 30분 더 확보</strong>하고, My Time은 조금 줄여{' '}
                  <strong>피부와 수면 회복을 우선</strong>하도록 시간을 재설계했어요. 😊
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

            {aiOpen && (
              <>
                <div className="home-ai-divider" />
                <button
                  type="button"
                  className="home-ai-collapse"
                  onClick={() => setAiOpen(false)}
                  aria-label="AI 코멘트 접기"
                >
                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                    <path d="M1 8L8 1L15 8" stroke="#A89EA1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                    <path d="M1 8L8 1L15 8" stroke="#A89EA1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </>
            )}
          </>
        )}

        {page === 1 && (
          <>
            <div className="home-ring-wrap">
              <svg className="home-ring-svg" viewBox="0 0 250 250" width="100%" height="100%">
                <MyTimeRingArcs />
                <circle cx="125" cy="125" r="84.5" fill="#FFEDED" stroke="#FFE0D6" strokeWidth="1" />
                <line
                  x1={myTimeRingNeedlePoint('mytime-0', 90).x}
                  y1={myTimeRingNeedlePoint('mytime-0', 90).y}
                  x2={myTimeRingNeedlePoint('mytime-0', 124).x}
                  y2={myTimeRingNeedlePoint('mytime-0', 124).y}
                  stroke="#D27373"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx={myTimeRingNeedlePoint('mytime-0', 124).x} cy={myTimeRingNeedlePoint('mytime-0', 124).y} r="4.5" fill="#D27373" />
              </svg>
              <div className="home-ring-center">
                <p className="home-ring-center-label">현재 시간은</p>
                <p className="home-ring-center-value">My Time</p>
              </div>
            </div>

            <div className="home-stats">
              {TIME_ENTRIES.map((stat) => (
                <div key={stat.key} className="home-stat">
                  <stat.Icon className={stat.iconClass} />
                  <p className={`home-stat-label-${stat.key}`}>{stat.label}</p>
                  <div className="home-stat-entries">
                    {stat.entries.map((entry, i) => (
                      <div key={i} className="home-stat-entry">
                        <span className="home-stat-time">{entry.time}</span>
                        <span className={`home-stat-tag home-stat-tag-${stat.key}`}>{entry.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default Home;
