import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/images/backbutton.svg';
import { ReactComponent as ScanDIcon } from '../../assets/images/scan-d.svg';
import { ReactComponent as ScanEIcon } from '../../assets/images/scan-e.svg';
import { ReactComponent as ScanNIcon } from '../../assets/images/scan-n.svg';
import { ReactComponent as ScanOIcon } from '../../assets/images/scan-o.svg';
import './ManualEntry.css';

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

function ManualEntry() {
  const navigate = useNavigate();
  const [days, setDays] = useState(INITIAL_DAYS);
  const [openIndex, setOpenIndex] = useState(null);

  const handleSelectShift = (index, shift) => {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, shift } : d)));
    setOpenIndex(null);
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
                <span className="manual-entry-row-date">{d.date}</span>
                <span className="manual-entry-row-day">{d.dayName}</span>

                <div className="manual-entry-shift-picker">
                  <button
                    type="button"
                    className={openIndex === index ? 'manual-entry-shift-toggle is-open' : 'manual-entry-shift-toggle'}
                    onClick={() => setOpenIndex((open) => (open === index ? null : index))}
                  >
                    {(() => {
                      const ScanIcon = SCAN_SHIFT_ICONS[d.shift];
                      return <ScanIcon />;
                    })()}
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

          <button
            type="button"
            className="btn btn-primary btn-full manual-entry-submit"
            onClick={() => navigate('/work-schedule/register-complete')}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManualEntry;
