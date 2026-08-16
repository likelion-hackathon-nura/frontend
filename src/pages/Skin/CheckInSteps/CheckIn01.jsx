import React from 'react'

import './CheckIn01.css'

import FatigueLevel01 from '../../../assets/images/fatigue_level_1.svg'
import FatigueLevel02 from '../../../assets/images/fatigue_level_2.svg'
import FatigueLevel03 from '../../../assets/images/fatigue_level_3.svg'
import FatigueLevel04 from '../../../assets/images/fatigue_level_4.svg'
import FatigueLevel05 from '../../../assets/images/fatigue_level_5.svg'
import WarningIcon from '../../../assets/images/warning_icon.svg'



const CheckIn01 = ({ fatigue, onChange, onNext }) => {
  return (
    <div className="checkin01_wrap">
      <div className="checkin01_top">
        오늘의 피로도를<br />기록해주세요.
      </div>

      <div className="checkin01_main">
        <div className="checkin01_m_1">지금 몸과 마음이 어느정도로 지쳐있나요?</div>

        <div className="checkin01_m_2">

          <div className={`checkin01_m_2_box ${fatigue === 5 ? 'span' : ''}`} onClick={() => onChange(5)}>
            <img src={FatigueLevel01} alt="" />
            <p>매우 지침</p>
          </div>

          <div className={`checkin01_m_2_box ${fatigue === 4 ? 'span' : ''}`} onClick={() => onChange(4)}>
            <img src={FatigueLevel02} alt="" />
            <p>피곤함</p>
          </div>

          <div className={`checkin01_m_2_box ${fatigue === 3 ? 'span' : ''}`} onClick={() => onChange(3)}>
            <img src={FatigueLevel03} alt="" />
            <p>보통</p>
          </div>

          <div className={`checkin01_m_2_box ${fatigue === 2 ? 'span' : ''}`} onClick={() => onChange(2)}>
            <img src={FatigueLevel04} alt="" />
            <p>좋음</p>
          </div>

          <div className={`checkin01_m_2_box ${fatigue === 1 ? 'span' : ''}`} onClick={() => onChange(1)}>
            <img src={FatigueLevel05} alt="" />
            <p>매우 좋음</p>
          </div>
        </div>


        <div className="checkin01_m_3">
          <img src={WarningIcon} alt="" />
          <div className="checkin01_m_3_txt">피로도가 더 높을 수록,<br />3분 회복 모드에서 더 짧고 간결한 루틴을 안내해요.</div>
        </div>

        <button onClick={onNext} disabled={fatigue === null} className='checkin_bot_btn'>
          다음
        </button>

      </div>

    </div>

  )
}

export default CheckIn01
