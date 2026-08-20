import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCheckin } from '../../api/skin'

import './CheckIn.css'

import CheckIn01 from './CheckInSteps/CheckIn01'
import CheckIn02 from './CheckInSteps/CheckIn02'
import CheckIn03 from './CheckInSteps/CheckIn03'
import CheckIn04 from './CheckInSteps/CheckIn04'
import CheckIn05 from './CheckInSteps/CheckIn05'
import PrevBtn from '../../assets/images/prev_btn.svg'

const getTodayDate = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]

const CheckIn = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)

    const [checkinData, setCheckinData] = useState({
        fatigue: null,
        tightness: null,
        redness: null,
        photo: null,
    })

    const [analysisComplete, setAnalysisComplete] = useState(false)

    const handleFatigueChange = value => {
        setCheckinData(prev => ({
            ...prev,
            fatigue: value,
        }))
    }

    const handleSkinConditionChange = (name, value) => {
        setCheckinData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handlePhotoChange = file => setCheckinData(prev => ({ ...prev, photo: file }))

    const handleSubmit = async (photo = checkinData.photo) => {
        const submitData = { ...checkinData, photo }

        setCheckinData(submitData)
        setAnalysisComplete(false)
        setStep(4)

        try {
            await createCheckin({ date: getTodayDate(), ...submitData })
            setAnalysisComplete(true)
        } catch (error) {
            console.error('체크인 실패:', error)

            const errorMessage =
                error.message || '체크인 중 오류가 발생했습니다.'

            alert(errorMessage)

            if (errorMessage.includes('이미 존재합니다')) {
                navigate('/skin', { replace: true })
                return
            }

            setStep(3)
        }
    }

    const handleStartRecovery = () => navigate('/recovery')
    const handleExit = () => navigate('/skin')

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

            {step === 1 && (
                <CheckIn01
                    fatigue={checkinData.fatigue}
                    onChange={handleFatigueChange}
                    onNext={handleNext}
                />
            )}
            {step === 2 && (
                <CheckIn02
                    tightness={checkinData.tightness}
                    redness={checkinData.redness}
                    onChange={handleSkinConditionChange}
                    onNext={handleNext}
                />
            )}
            {step === 3 && <CheckIn03 photo={checkinData.photo} onPhotoChange={handlePhotoChange} onNext={handleSubmit} />}
            {step === 4 && <CheckIn04 isComplete={analysisComplete} onNext={handleNext} />}
            {step === 5 && <CheckIn05 onRecovery={handleStartRecovery} onExit={handleExit} />}
        </div>
    )
}

export default CheckIn
