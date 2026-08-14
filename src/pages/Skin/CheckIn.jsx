import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './CheckIn.css'

import CheckIn01 from './CheckInSteps/CheckIn01'
import CheckIn02 from './CheckInSteps/CheckIn02'
import CheckIn03 from './CheckInSteps/CheckIn03'
import CheckIn04 from './CheckInSteps/CheckIn04'
import CheckIn05 from './CheckInSteps/CheckIn05'

import PrevBtn from '../../assets/images/prev_btn.svg'

const CheckIn = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)

    const handleNext = () => {
        setStep(prev => Math.min(prev + 1, 5))
    }

    const handlePrev = () => {
        if (step === 0) {
            navigate('/skin')
        } else {
            setStep(prev => prev - 1)
        }
    }

    return (
        <div className="page checkin_wrap" style={{ background: step >= 1 && step <= 3 ? '#ffffff' : undefined }}>
            {step <= 3 && (
                <img
                    className="prev_btn"
                    src={PrevBtn}
                    alt="이전"
                    onClick={handlePrev}
                />
            )}

            {step >= 1 && step <= 3 && (
                <div className="checkin_progress">
                    {[1, 2, 3].map(number => (
                        <span
                            key={number}
                            className={`progress_bar ${step >= number ? 'active' : ''
                                }`}
                        />
                    ))}
                </div>
            )}

            {step === 0 && (
                <>
                    <p className='checkin_title'>오늘의 컨디션,<br />함께 체크인 해볼까요?</p>
                    <p className='checkin_content'>체크인을 완료하면, 오늘의 피부 상태에 맞는<br />3분 회복 모드를 추천해드려요.</p>
                    <button onClick={handleNext} className='checkin_bot_btn'>시작하기</button>
                </>
            )}

            {step === 1 && <CheckIn01 onNext={handleNext} />}
            {step === 2 && <CheckIn02 onNext={handleNext} />}
            {step === 3 && <CheckIn03 onNext={handleNext} />}
            {step === 4 && <CheckIn04 onNext={handleNext} />}
            {step === 5 && <CheckIn05 />}
        </div>
    )
}

export default CheckIn
