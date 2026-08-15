import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './Recovery.css'
import Recovery01 from './RecoveryStep/Recovery01'
import Recovery02 from './RecoveryStep/Recovery02'
import Recovery03 from './RecoveryStep/Recovery03'

import PrevBtn from '../../assets/images/prev_btn.svg'
import RecoveryIcon01 from '../../assets/images/recovery_icon_1.svg'
import RecoveryIcon02 from '../../assets/images/recovery_icon_2.svg'
import RecoveryTime from '../../assets/images/skin_time.svg'
import RecoveryLine from '../../assets/images/skin_line.svg'

import RecoveryUseProduct01 from '../../assets/images/recovery_product_1.svg'
import RecoveryUseProduct04 from '../../assets/images/recovery_product_4.svg'



const Recovery = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)

    const handleNext = () => {
        setStep(prev => prev + 1)
    }

    const handlePrev = () => {
        if (step === 0) {
            navigate('/skin')
        } else {
            setStep(prev => prev - 1)
        }
    }

    const matchedProduct = {
        name: '마일드 시카 세럼',
        description: '민감성 피부에 적합한 저자극 진정 세럼',
        ingredients: '병풀추출물, 판테놀 함유',
        image: RecoveryUseProduct01,
    }

    const matchedProduct02 = {
        name: '세라마이드 수분 크림',
        description: '피부에 수분 보호막을 형성하는 보습 크림',
        ingredients: '진정 단계 이후 사용',
        image: RecoveryUseProduct04,
    }

    return (
        <div className="page recovery_wrap">
            {step < 3 && (
                <button
                    className="recovery_prev_btn"
                    onClick={handlePrev}
                >
                    <img src={PrevBtn} alt="이전" />
                </button>
            )}

            {step === 0 && (
                <>
                    <div className="recovery_top">
                        <p className="recovery_top_1">퇴근 체크인 분석 결과</p>
                        <p className="recovery_top_2">오늘은 2단계로<br />회복 모드를 안내해드릴게요.</p>
                        <p className="recovery_top_3">피로도는 높고 피부 당김이 심하게 기록됐어요.<br />오늘은 진정과 보습에 필요한 최소 단계만 진행할게요.</p>
                    </div>

                    <div className="recovery_step_list">

                        <div className="recovery_step">
                            <img src={RecoveryIcon01} alt="" />
                            <div className="recovery_step_content">
                                <div className="recovery_step_title">
                                    <span>STEP 1</span>
                                    <p>진정</p>
                                </div>
                                <p>피부를 외부 자극으로부터 가라앉혀요.</p>
                            </div>
                            <div className="recovery_step_time">
                                <img src={RecoveryTime} alt="" />
                                <p>1M</p>
                            </div>
                        </div>

                        <img src={RecoveryLine} alt="" />

                        <div className="recovery_step">
                            <img src={RecoveryIcon02} alt="" />
                            <div className="recovery_step_content">
                                <div className="recovery_step_title">
                                    <span>STEP 2</span>
                                    <p>보습</p>
                                </div>
                                <p>수분을 채워 피부 장벽을 보호해요.</p>
                            </div>

                            <div className="recovery_step_time">
                                <img src={RecoveryTime} alt="" />
                                <p>1M</p>
                            </div>
                        </div>
                    </div>

                    <button className="recovery_bot_btn" onClick={handleNext}>
                        시작하기
                    </button>
                </>

            )}

            {step === 1 && (
                <Recovery01
                    onNext={handleNext}
                    matchedProduct={matchedProduct}
                />
            )}

            {step === 2 && (
                <Recovery02
                    matchedProduct={matchedProduct02}
                    onComplete={handleNext}
                />
            )}

            {step === 3 && (
                <Recovery03
                    onComplete={() => navigate('/skin')}
                />
            )}

        </div>
    )
}

export default Recovery
