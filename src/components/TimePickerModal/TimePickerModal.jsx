import { useEffect, useRef, useState } from 'react';
import { ReactComponent as ExitIcon } from '../../assets/images/exit.svg';
import './TimePickerModal.css';

const ITEM_HEIGHT = 44;
const PADDING_COUNT = 2;

function generateTimes() {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return times;
}

const TIMES = generateTimes();

function TimePickerModal({ label, value, onConfirm, onClose }) {
  const listRef = useRef(null);
  const initialIndex = Math.max(TIMES.indexOf(value), 0);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = initialIndex * ITEM_HEIGHT;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    if (!listRef.current) return;
    const index = Math.round(listRef.current.scrollTop / ITEM_HEIGHT);
    setSelectedIndex(Math.min(Math.max(index, 0), TIMES.length - 1));
  };

  const handleConfirm = () => {
    onConfirm(TIMES[selectedIndex]);
  };

  return (
    <div className="time-picker-overlay" onClick={onClose}>
      <div className="time-picker-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="time-picker-header">
          <span>{label}</span>
          <button type="button" className="time-picker-close" onClick={onClose} aria-label="닫기">
            <ExitIcon />
          </button>
        </div>

        <div className="time-picker-wheel">
          <div className="time-picker-highlight" />
          <div className="time-picker-list" ref={listRef} onScroll={handleScroll}>
            <div style={{ height: ITEM_HEIGHT * PADDING_COUNT }} />
            {TIMES.map((t, i) => (
              <div
                key={t}
                className={i === selectedIndex ? 'time-picker-item is-selected' : 'time-picker-item'}
                style={{ opacity: Math.max(1 - Math.abs(i - selectedIndex) * 0.35, 0.2) }}
              >
                {t}
              </div>
            ))}
            <div style={{ height: ITEM_HEIGHT * PADDING_COUNT }} />
          </div>
        </div>

        <button type="button" className="btn btn-primary btn-full time-picker-confirm" onClick={handleConfirm}>
          확인
        </button>
      </div>
    </div>
  );
}

export default TimePickerModal;
