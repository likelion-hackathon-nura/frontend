import React from 'react'

import './CheckIn05.css'

import CheckinFinIcon from '../../../assets/images/checkin_fin_icon.svg'

const CheckIn05 = () => {
    return (
        <div className="checkin05_wrap">
            <img src={CheckinFinIcon} alt="" />
            <p className='check05_txt'>분석이 완료되었어요.<br />이어서 3분 회복 모드를 진행할까요?</p>
            <button className='checkin05_refresh'>3분 회복 모드 진행하기</button>
            <button className='checkin05_exit'>나가기</button>
        </div>
    )
}

export default CheckIn05