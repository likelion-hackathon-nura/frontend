import { useEffect, useRef, useState } from 'react';
import { ReactComponent as ExitIcon } from '../../assets/images/exit.svg';
import './DatePickerModal.css';

const ITEM_HEIGHT = 44;
const PADDING_COUNT = 2;

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

function Wheel({ items, unit, selected, onChange }) {
  const listRef = useRef(null);
  const initialIndex = Math.max(items.indexOf(selected), 0);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = initialIndex * ITEM_HEIGHT;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    if (!listRef.current) return;
    const index = Math.round(listRef.current.scrollTop / ITEM_HEIGHT);
    const clamped = Math.min(Math.max(index, 0), items.length - 1);
    onChange(items[clamped]);
  };

  return (
    <div className="date-picker-list" ref={listRef} onScroll={handleScroll}>
      <div style={{ height: ITEM_HEIGHT * PADDING_COUNT }} />
      {items.map((item) => {
        const isSelected = item === selected;
        return (
          <div
            key={item}
            className={isSelected ? 'date-picker-item is-selected' : 'date-picker-item'}
            style={{ opacity: Math.max(1 - Math.abs(items.indexOf(item) - initialIndex) * 0.35, 0.2) }}
          >
            {String(item).padStart(2, '0')}
            {unit}
          </div>
        );
      })}
      <div style={{ height: ITEM_HEIGHT * PADDING_COUNT }} />
    </div>
  );
}

function DatePickerModal({ value, onConfirm, onClose }) {
  const [month, setMonth] = useState(value?.month ?? new Date().getMonth() + 1);
  const [day, setDay] = useState(value?.day ?? new Date().getDate());

  const handleConfirm = () => {
    onConfirm({ month, day });
  };

  return (
    <div className="date-picker-overlay" onClick={onClose}>
      <div className="date-picker-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="date-picker-header">
          <span>날짜</span>
          <button type="button" className="date-picker-close" onClick={onClose} aria-label="닫기">
            <ExitIcon />
          </button>
        </div>

        <div className="date-picker-wheel">
          <div className="date-picker-highlight" />
          <Wheel items={MONTHS} unit="월" selected={month} onChange={setMonth} />
          <Wheel items={DAYS} unit="일" selected={day} onChange={setDay} />
        </div>

        <button type="button" className="btn btn-primary btn-full date-picker-confirm" onClick={handleConfirm}>
          확인
        </button>
      </div>
    </div>
  );
}

export default DatePickerModal;
