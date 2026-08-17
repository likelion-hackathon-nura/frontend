import React, { useRef } from 'react'

import './CheckIn03.css'

import CheckinPhotoIcon from '../../../assets/images/checkin_photo_icon.svg'
import NextArrow from '../../../assets/images/next_arrow.svg'
import CheckinTipIcon from '../../../assets/images/checkin_tip.svg'

const CheckIn03 = ({ photo, onPhotoChange, onNext }) => {
    const fileInputRef = useRef(null)
    const handleFileChange = event => onPhotoChange(event.target.files?.[0] || null)

    return (
        <div className="checkin03_wrap">
            <div className="checkin03_top">
                더 세밀한 분석을 위해<br />얼굴 사진을 업로드 해주세요.
            </div>

            <div className="checkin03_main">

                <div className="checkin03_m_photo">
                    <img src={CheckinPhotoIcon} alt="" />
                    <p>{photo ? photo.name : '정면 사진을 업로드 해주세요.'}</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} hidden />
                    <button type="button" className='checkin03_m_p_btn' onClick={() => fileInputRef.current?.click()}>
                        {photo ? '사진 다시 선택하기' : '사진 업로드하기'}<img src={NextArrow} alt="" />
                    </button>
                </div>

                <div className="checkin03_m_tip">
                    <p className='checkin03_m_t_top'>사진 촬영 Tip!</p>
                    <div className="checkin03_m_t_box">
                        <div className="checkin03_m_t_b_2">
                            <img src={CheckinTipIcon} alt="" />
                            <p>밝은 곳에서 촬영해주세요.</p>
                        </div>
                        <div className="checkin03_m_t_b_2">
                            <img src={CheckinTipIcon} alt="" />
                            <p>얼굴 전체가 보이도록 정면에서 촬영해주세요.</p>
                        </div>
                        <div className="checkin03_m_t_b_2">
                            <img src={CheckinTipIcon} alt="" />
                            <p>메이크업이나 필터는 잠시 꺼주세요.</p>
                        </div>
                    </div>
                </div>

                <p className='checkin03_skip' onClick={() => onNext(null)}>건너뛰기</p>

                <button onClick={() => onNext(photo)} className='checkin_bot_btn'>결과 보기</button>

            </div>

        </div>
    )
}

export default CheckIn03
