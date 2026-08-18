import React from 'react'

import './Recovery03.css'

import RecoveryFinIcon from '../../../assets/images/checkin_fin_icon.svg'



const Recovery03 = ({ onComplete }) => {

    return (
        <div className="recovery03_wrap">

            <div className="recovery03_top">
                <img src={RecoveryFinIcon} alt="회복 모드 완료" className="recovery03_check" />
                <p className="recovery03_title">3분 회복 모드가 완료되었어요👋🏻</p>
            </div>

            <div className="recovery03_main">
                <button
                    type="button"
                    className="recovery03_complete_btn"
                    onClick={onComplete}
                >
                    완료
                </button>
            </div>
        </div>
    )
}

export default Recovery03