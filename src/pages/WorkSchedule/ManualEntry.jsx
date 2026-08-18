import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as ScanDIcon } from '../../assets/images/scan-d.svg';
import { ReactComponent as ScanEIcon } from '../../assets/images/scan-e.svg';
import { ReactComponent as ScanNIcon } from '../../assets/images/scan-n.svg';
import { ReactComponent as ScanOIcon } from '../../assets/images/scan-o.svg';
import { getSchedules } from '../../api/home';
import { saveSchedules } from '../../api/schedule';
import { ApiError } from '../../api/client';
import './ManualEntry.css';

const SCAN_SHIFT_ICONS = {
  D: ScanDIcon,
  N: ScanNIcon,
  E: ScanEIcon,
  OFF: ScanOIcon,
};

const SHIFT_OPTIONS = ['D', 'N', 'E', 'OFF'];

const DAY_NAMES = {
  MONDAY: '월요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
  THURSDAY: '목요일',
  FRIDAY: '금요일',
  SATURDAY: '토요일',
  SUNDAY: '일요일',
};

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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

function ManualEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const todayStr = formatDate(new Date());
  const [weekStart, weekEnd] = getWeekRange(new Date());
  const weekStartStr = formatDate(weekStart);
  const weekEndStr = formatDate(weekEnd);

  const { data: scheduleData } = useQuery({
    queryKey: ['schedules', weekStartStr, weekEndStr],
    queryFn: () => getSchedules(weekStartStr, weekEndStr),
  });

  const [days, setDays] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [error, setError] = useState(location.state?.ocrError || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!scheduleData?.schedules) return;
    setDays(
      scheduleData.schedules.map((s) => ({
        date: s.date,
        display: `${Number(s.date.split('-')[1])}/${Number(s.date.split('-')[2])}`,
        dayName: DAY_NAMES[s.dayOfWeek] || '',
        shift: s.shiftType || null,
        originalShift: s.shiftType || null,
        editable: s.date >= todayStr && !(s.date === todayStr && s.shiftType),
      })),
    );
  }, [scheduleData, todayStr]);

  const handleSelectShift = (index, shift) => {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, shift } : d)));
    setOpenIndex(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const changed = days.filter((d) => d.editable && d.shift && d.shift !== d.originalShift);
    if (changed.length === 0) {
      setError('변경된 근무가 없어요.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await saveSchedules({
        source: 'MANUAL',
        schedules: changed.map((d) => ({ date: d.date, shiftType: d.shift })),
      });
      navigate('/work-schedule/register-complete');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '근무표 저장에 실패했어요. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page manual-entry-page">
      <div className="manual-entry-header">
        <button type="button" className="manual-entry-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <BackIcon />
        </button>
      </div>

      <h1 className="manual-entry-title">근무표를 직접 작성해 주세요.</h1>
      <p className="manual-entry-subtitle">날짜와 근무 유형을 탭하여 작성해 주세요.</p>

      <div className="manual-entry-card-wrap">
        <div className="manual-entry-card">
          <div className="manual-entry-list-card">
            {days.map((d, index) => (
              <div key={d.date} className="manual-entry-row">
                <span className="manual-entry-check">
                  <span className="manual-entry-check-mark" />
                </span>
                <span className="manual-entry-row-date">{d.display}</span>
                <span className="manual-entry-row-day">{d.dayName}</span>

                <div className="manual-entry-shift-picker">
                  <button
                    type="button"
                    className={openIndex === index ? 'manual-entry-shift-toggle is-open' : 'manual-entry-shift-toggle'}
                    disabled={!d.editable}
                    onClick={() => d.editable && setOpenIndex((open) => (open === index ? null : index))}
                  >
                    {d.shift ? (
                      (() => {
                        const ScanIcon = SCAN_SHIFT_ICONS[d.shift];
                        return <ScanIcon />;
                      })()
                    ) : (
                      <span className="manual-entry-shift-placeholder">선택</span>
                    )}
                  </button>

                  {openIndex === index && (
                    <ul className="manual-entry-shift-list">
                      {SHIFT_OPTIONS.filter((option) => option !== d.shift).map((option) => (
                        <li key={option}>
                          <button
                            type="button"
                            className={`manual-entry-shift-option shift-option-${option}`}
                            onClick={() => handleSelectShift(index, option)}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="manual-entry-error">{error}</p>}

          <button type="button" className="btn btn-primary btn-full manual-entry-submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '완료'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManualEntry;
