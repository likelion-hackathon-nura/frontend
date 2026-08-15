import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as HomeDayIcon } from '../../assets/images/home_day.svg';
import { ReactComponent as HomeEveningIcon } from '../../assets/images/home_evening.svg';
import { ReactComponent as HomeNightIcon } from '../../assets/images/home_night.svg';
import { ReactComponent as HomeOffIcon } from '../../assets/images/home_off.svg';
import { ReactComponent as ScanDIcon } from '../../assets/images/scan-d.svg';
import { ReactComponent as ScanEIcon } from '../../assets/images/scan-e.svg';
import { ReactComponent as ScanNIcon } from '../../assets/images/scan-n.svg';
import { ReactComponent as ScanOIcon } from '../../assets/images/scan-o.svg';
import './ScanResult.css';

const SHIFT_ICONS = {
  D: HomeDayIcon,
  E: HomeEveningIcon,
  N: HomeNightIcon,
  OFF: HomeOffIcon,
};

const SCAN_SHIFT_ICONS = {
  D: ScanDIcon,
  N: ScanNIcon,
  E: ScanEIcon,
  OFF: ScanOIcon,
};

const SHIFT_OPTIONS = ['D', 'N', 'E', 'OFF'];

const INITIAL_DAYS = [
  { date: '7/16', dayName: '월요일', shift: 'N' },
  { date: '7/17', dayName: '화요일', shift: 'OFF' },
  { date: '7/18', dayName: '수요일', shift: 'D' },
  { date: '7/19', dayName: '목요일', shift: 'N' },
  { date: '7/20', dayName: '금요일', shift: 'N' },
  { date: '7/21', dayName: '토요일', shift: 'E' },
  { date: '7/22', dayName: '일요일', shift: 'E' },
];

function ScanResult() {
  const navigate = useNavigate();
  const [days, setDays] = useState(INITIAL_DAYS);
  const [openIndex, setOpenIndex] = useState(null);

  const handleSelectShift = (index, shift) => {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, shift } : d)));
    setOpenIndex(null);
  };

  return (
    <div className="page scan-result-page">
      <div className="scan-result-header">
        <button type="button" className="scan-result-back" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <BackIcon />
        </button>
      </div>

      <h1 className="scan-result-title">스캔이 완료되었어요.</h1>
      <p className="scan-result-subtitle">내용을 확인한 뒤 필요한 부분을 수정해 주세요.</p>

      <div className="scan-result-card-wrap">
        <div className="scan-result-card">
          <div className="scan-result-calendar-card">
            <p className="scan-result-range">7/16 ~ 7/22</p>
            <div className="scan-result-calendar-days">
              {days.map((d) => {
                const ShiftIcon = SHIFT_ICONS[d.shift];
                return (
                <div key={d.date} className="scan-result-calendar-day">
                  <span className="scan-result-calendar-label">{d.dayName[0]}</span>
                  <span className="scan-result-calendar-date">{d.date.split('/')[1]}</span>
                  <ShiftIcon className="scan-result-calendar-icon" />
                </div>
                );
              })}
            </div>
          </div>

          <p className="scan-result-hint">근무 유형을 탭하여 수정할 수 있어요.</p>

          <div className="scan-result-list-card">
            {days.map((d, index) => (
              <div key={d.date} className="scan-result-row">
                <span className="scan-result-check">
                  <span className="scan-result-check-mark" />
                </span>
                <span className="scan-result-row-date">{d.date}</span>
                <span className="scan-result-row-day">{d.dayName}</span>

                <div className="scan-result-shift-picker">
                  <button
                    type="button"
                    className={openIndex === index ? 'scan-result-shift-toggle is-open' : 'scan-result-shift-toggle'}
                    onClick={() => setOpenIndex((open) => (open === index ? null : index))}
                  >
                    {(() => {
                      const ScanIcon = SCAN_SHIFT_ICONS[d.shift];
                      return <ScanIcon />;
                    })()}
                  </button>

                  {openIndex === index && (
                    <ul className="scan-result-shift-list">
                      {SHIFT_OPTIONS.filter((option) => option !== d.shift).map((option) => (
                        <li key={option}>
                          <button
                            type="button"
                            className={`scan-result-shift-option shift-option-${option}`}
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

          <button
            type="button"
            className="btn btn-primary btn-full scan-result-submit"
            onClick={() => navigate('/work-schedule/register-complete')}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScanResult;
