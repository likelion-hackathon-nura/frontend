import React from 'react'

import './CheckIn02.css'

import FatigueLevel01 from '../../../assets/images/fatigue_level_1.svg'
import FatigueLevel02 from '../../../assets/images/fatigue_level_2.svg'
import FatigueLevel03 from '../../../assets/images/fatigue_level_3.svg'
import FatigueLevel04 from '../../../assets/images/fatigue_level_4.svg'

const CheckIn02 = ({ onNext }) => {
    return (
        <div className="checkin02_wrap">
            <div className="checkin02_top">
                오늘의 피부 상태를<br />기록해주세요.
            </div>

            <div className="checkin02_main">
                <div className="checkin02_txt01">
                    <p>피부 당김</p>
                    <span>세안 후나 활동 중 피부가 건조하거나 당기는 느낌이 있나요?</span>
                </div>

                <div className="checkin02_m_1">
                    <div className="checkin02_m_1_box">
                        <img src={FatigueLevel01} alt="" />
                        <p>없음</p>
                    </div>

                    <div className="checkin02_m_1_box">
                        <img src={FatigueLevel02} alt="" />
                        <p>약간</p>
                    </div>

                    <div className="checkin02_m_1_box">
                        <img src={FatigueLevel03} alt="" />
                        <p>보통</p>
                    </div>

                    <div className="checkin02_m_1_box span">
                        <img src={FatigueLevel04} alt="" />
                        <p>심함</p>
                    </div>
                </div>

                <div className="checkin02_txt02">
                    <p>붉은기/트러블</p>
                    <span>붉은기나 트러블, 민감함이 느껴지나요?</span>
                </div>

                <div className="checkin02_m_2">
                    <div className="checkin02_m_2_box">
                        <img src={FatigueLevel01} alt="" />
                        <p>없음</p>
                    </div>

                    <div className="checkin02_m_2_box">
                        <img src={FatigueLevel02} alt="" />
                        <p>약간</p>
                    </div>

                    <div className="checkin02_m_2_box">
                        <img src={FatigueLevel03} alt="" />
                        <p>보통</p>
                    </div>

                    <div className="checkin02_m_2_box span">
                        <img src={FatigueLevel04} alt="" />
                        <p>심함</p>
                    </div>
                </div>

                <button onClick={onNext} className='checkin_bot_btn'>다음</button>

            </div>

        </div>

    )
}

export default CheckIn02