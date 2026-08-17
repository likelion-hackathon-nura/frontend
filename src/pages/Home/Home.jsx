import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import BottomNav from '../../components/BottomNav/BottomNav';
import { createOrGetTodayHome, getSchedules } from '../../api/home';
import { ApiError } from '../../api/client';
import { ReactComponent as NightTopIcon } from '../../assets/images/night-today.svg';
import { ReactComponent as DayTopIcon } from '../../assets/images/day-today.svg';
import { ReactComponent as EveningTopIcon } from '../../assets/images/evening-today.svg';
import { ReactComponent as OffTopIcon } from '../../assets/images/off-today.svg';
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

const SHIFT_GREETING_LABELS = {
  D: '데이 근무',
  E: '이브닝 근무',
  N: '나이트 근무',
  OFF: '휴무',
};

const SHIFT_TOP_ICONS = {
  D: DayTopIcon,
  E: EveningTopIcon,
  N: NightTopIcon,
  OFF: OffTopIcon,
};

const DAY_OF_WEEK_LABELS = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};

const BLOCK_CATEGORY_TO_KEY = {
  SOCIAL: 'social',
  REFRESH: 'refresh',
  MY: 'mytime',
};

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getWeekRange(date) {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return [monday, sunday];
}

function formatMinutes(totalMinutes) {
  const minutes = totalMinutes || 0;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
}

function formatTime(isoDateTime) {
  return isoDateTime ? isoDateTime.slice(11, 16) : '';
}

function formatClock(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

const TIME_ENTRY_META = [
  { key: 'social', label: 'Social Time', Icon: SocialIcon, iconClass: 'social-time-icon' },
  { key: 'refresh', label: 'Refresh Time', Icon: RefreshIcon, iconClass: 'refresh-time-icon' },
  { key: 'mytime', label: 'My Time', Icon: MytimeIcon, iconClass: 'my-time-icon' },
];

function renderRingCenterValue(label) {
  if (label === '배정된 일정이 없어요') {
    return (
      <>
        배정된 일정이
        <br />
        없어요
      </>
    );
  }
  const parts = label.split(' ');
  if (parts.length === 2 && label !== 'My Time') {
    return (
      <>
        {parts[0]}
        <br />
        {parts[1]}
      </>
    );
  }
  return label;
}

function findCurrentCategoryLabel(blocks, now) {
  const current = (blocks || []).find((b) => {
    const start = new Date(b.startAt);
    const end = new Date(b.endAt);
    return now >= start && now <= end;
  });
  if (!current) return '배정된 일정이 없어요';
  const meta = TIME_ENTRY_META.find((m) => m.key === BLOCK_CATEGORY_TO_KEY[current.category]);
  return meta ? meta.label : '배정된 일정이 없어요';
}

function groupBlocksByCategory(blocks) {
  const grouped = { social: [], refresh: [], mytime: [] };
  (blocks || []).forEach((block) => {
    const key = BLOCK_CATEGORY_TO_KEY[block.category];
    if (!key) return;
    grouped[key].push({ time: `${formatTime(block.startAt)} ~ ${formatTime(block.endAt)}`, tag: block.label || '' });
  });
  return grouped;
}

// Today ring (page 1): dynamic 3-segment ring driven by real social/refresh/my
// minute proportions. Same visual language (gap size, tick overlay, bead caps)
// as the My Time ring below, just one arc per category instead of split arcs.
const TODAY_RING_ORDER = ['refresh', 'social', 'mytime'];
const TODAY_RING_STYLE = {
  refresh: { base: '#F7C1C1', tick: '#F18E8E' },
  social: { base: '#AEADC1', tick: '#6B698E' },
  mytime: { base: '#FAF0DD', tick: '#F5E3C1' },
};

function buildTodayRingSegments(percents) {
  const usableDeg = 360 - MYTIME_RING_GAP_DEG * TODAY_RING_ORDER.length;
  let angle = 0;
  return TODAY_RING_ORDER.map((key) => {
    const subDeg = ((percents[key] || 0) / 100) * usableDeg;
    const start = angle;
    const end = angle + subDeg;
    angle = end + MYTIME_RING_GAP_DEG;
    return { key, start, end, ...TODAY_RING_STYLE[key] };
  });
}

function RingArcs({ percents }) {
  const segments = buildTodayRingSegments(percents);
  const gaps = segments.map((seg, i) => {
    const next = segments[(i + 1) % segments.length];
    const to = i === segments.length - 1 ? 360 : next.start;
    return { key: `gap-${i}`, from: seg.end, to };
  });

  return (
    <g>
      {segments.map((seg) => (
        <path key={seg.key} d={myTimeRingArcPath(seg.start, seg.end)} fill="none" stroke={seg.base} strokeWidth="30" strokeLinecap="round" />
      ))}
      {segments.map((seg) => (
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
      {gaps.map((gap) => (
        <path key={gap.key} d={myTimeRingArcPath(gap.from, gap.to)} fill="none" stroke="#E8E8E8" strokeWidth="30" />
      ))}
      {segments.map((seg) => {
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
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);
  const [hasAlarm, setHasAlarm] = useState(true);
  const [page, setPage] = useState(0);
  const [now, setNow] = useState(new Date());
  const touchStartX = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [weekStart, weekEnd] = getWeekRange(new Date());
  const weekStartStr = formatDate(weekStart);
  const weekEndStr = formatDate(weekEnd);
  const todayStr = formatDate(new Date());

  const {
    data: homeData,
    error: homeError,
  } = useQuery({ queryKey: ['home', 'today'], queryFn: createOrGetTodayHome, retry: false });

  const { data: scheduleData } = useQuery({
    queryKey: ['schedules', weekStartStr, weekEndStr],
    queryFn: () => getSchedules(weekStartStr, weekEndStr),
    retry: false,
  });

  useEffect(() => {
    if (homeError instanceof ApiError && homeError.code === 'ONBOARDING_NOT_COMPLETED') {
      navigate('/onboarding/step1');
    }
  }, [homeError, navigate]);

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

  const socialMinutes = homeData?.socialMinutes || 0;
  const refreshMinutes = homeData?.refreshMinutes || 0;
  const myMinutes = homeData?.myMinutes || 0;
  const totalMinutes = socialMinutes + refreshMinutes + myMinutes;
  const percents = {
    social: totalMinutes ? (socialMinutes / totalMinutes) * 100 : 0,
    refresh: totalMinutes ? (refreshMinutes / totalMinutes) * 100 : 0,
    mytime: totalMinutes ? (myMinutes / totalMinutes) * 100 : 0,
  };

  const weekDays = (scheduleData?.schedules || []).map((s) => ({
    date: s.date,
    label: DAY_OF_WEEK_LABELS[s.dayOfWeek] || '',
    dateNum: Number(s.date.slice(8, 10)),
    shift: s.shiftType,
    isToday: s.date === todayStr,
  }));

  const groupedEntries = groupBlocksByCategory(homeData?.blocks);
  const currentCategoryLabel = findCurrentCategoryLabel(homeData?.blocks, now);

  if (homeError && !(homeError instanceof ApiError && homeError.code === 'ONBOARDING_NOT_COMPLETED')) {
    return (
      <div className="page home-page">
        <p>홈 정보를 불러오지 못했어요.</p>
        <BottomNav />
      </div>
    );
  }

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

      <p className="home-greeting">{homeData?.nickname ? `${homeData.nickname}님, 좋은 아침이에요 🌞` : '좋은 아침이에요 🌞'}</p>
      <div className="home-today">
        <h1>{homeData?.shiftType ? `오늘은 ${SHIFT_GREETING_LABELS[homeData.shiftType]}예요` : '오늘의 근무표가 없어요'}</h1>
        {(() => {
          const TopIcon = SHIFT_TOP_ICONS[homeData?.shiftType];
          return TopIcon ? <TopIcon className="home-today-icon" /> : null;
        })()}
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
          {weekDays.map((d) => {
            const ShiftIcon = SHIFT_ICONS[d.shift];
            return (
            <div key={d.date} className={d.isToday ? 'calendar-day is-today' : 'calendar-day'}>
              <span className="calendar-day-label">{d.label}</span>
              <span className="calendar-day-date">{d.dateNum}</span>
              {ShiftIcon && <ShiftIcon className="calendar-day-shift-icon" />}
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
                <RingArcs percents={percents} />
                <circle cx="125" cy="125" r="84.5" fill="#FFEDED" stroke="#FFE0D6" strokeWidth="1" />
              </svg>
              <div className="home-ring-center">{formatClock(now)}</div>
            </div>

            <div className="home-stats">
              <div className="home-stat">
                <SocialIcon className="social-time-icon" />
                <p className="home-stat-label-social">Social Time</p>
                <p className="home-stat-value">{formatMinutes(socialMinutes)}</p>
                <span className="home-stat-pill home-stat-pill-social">{Math.round(percents.social)}%</span>
              </div>
              <div className="home-stat">
                <RefreshIcon className="refresh-time-icon" />
                <p className="home-stat-label-refresh">Refresh Time</p>
                <p className="home-stat-value">{formatMinutes(refreshMinutes)}</p>
                <span className="home-stat-pill home-stat-pill-refresh">{Math.round(percents.refresh)}%</span>
              </div>
              <div className="home-stat">
                <MytimeIcon className="my-time-icon" />
                <p className="home-stat-label-mytime">My Time</p>
                <p className="home-stat-value">{formatMinutes(myMinutes)}</p>
                <span className="home-stat-pill home-stat-pill-mytime">{Math.round(percents.mytime)}%</span>
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
                <p className="home-ai-body">{homeData?.aiComment}</p>
                <div className="home-ai-tags">
                  {(homeData?.badges || []).map((badge, i) => (
                    <span key={i} className="home-ai-tag">
                      {badge.text}
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
                <p className="home-ring-center-value">{renderRingCenterValue(currentCategoryLabel)}</p>
              </div>
            </div>

            <div className="home-stats">
              {TIME_ENTRY_META.map((stat) => (
                <div key={stat.key} className="home-stat">
                  <stat.Icon className={stat.iconClass} />
                  <p className={`home-stat-label-${stat.key}`}>{stat.label}</p>
                  <div className="home-stat-entries">
                    {groupedEntries[stat.key].map((entry, i) => (
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
