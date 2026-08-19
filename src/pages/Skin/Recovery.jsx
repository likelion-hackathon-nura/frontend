import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './Recovery.css'
import Recovery01 from './RecoveryStep/Recovery01'
import Recovery02 from './RecoveryStep/Recovery02'
import Recovery03 from './RecoveryStep/Recovery03'

import {
    completeTodaySkinRoutine,
    generateSkinRoutine,
    getTodaySkinRoutine,
} from '../../api/skin'

import PrevBtn from '../../assets/images/prev_btn.svg'
import RecoveryIcon01 from '../../assets/images/recovery_icon_1.svg'
import RecoveryIcon02 from '../../assets/images/recovery_icon_2.svg'
import RecoveryTime from '../../assets/images/skin_time.svg'
import RecoveryLine from '../../assets/images/skin_line.svg'
import RecoveryUseProduct01 from '../../assets/images/recovery_product_1.svg'
import RecoveryUseProduct02 from '../../assets/images/recovery_product_2.svg'
import RecoveryUseProduct03 from '../../assets/images/recovery_product_3.svg'
import RecoveryUseProduct04 from '../../assets/images/recovery_product_4.svg'

const getRoutineData = response => response?.data ?? response

const productImageMap = {
    LIGHT_GREEN: RecoveryUseProduct01,
    GREEN: RecoveryUseProduct02,
    YELLOW: RecoveryUseProduct03,
    BLUE: RecoveryUseProduct04,
}

const createMatchedProduct = stepData => {
    if (!stepData?.cosmeticName) return null

    const productFeatures = Array.isArray(stepData.productFeatures)
        ? stepData.productFeatures
        : []

    return {
        name: [stepData.cosmeticBrand, stepData.cosmeticName]
            .filter(Boolean)
            .join(' '),
        description: productFeatures[0] || stepData.reason || '',
        ingredients: productFeatures[1] || stepData.cosmeticCoreIngredients || '',
        image:
            stepData.cosmeticUrl ||
            productImageMap[stepData.categoryColor] ||
            RecoveryUseProduct01,
    }
}

const Recovery = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)

    const requestStarted = useRef(false)
    const [routine, setRoutine] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (requestStarted.current) return
        requestStarted.current = true

        const loadRoutine = async () => {
            try {
                let routineData

                try {
                    const response = await getTodaySkinRoutine()
                    routineData = getRoutineData(response)

                    if (!routineData?.steps?.length) {
                        throw new Error('오늘 생성된 루틴 없음')
                    }
                } catch {
                    const response = await generateSkinRoutine()
                    routineData = getRoutineData(response)
                }

                if (!routineData?.steps?.length) {
                    throw new Error('회복 루틴을 불러올 수 없습니다.')
                }

                setRoutine(routineData)
            } catch (error) {
                console.error('회복 루틴 조회 또는 생성 실패:', error)
                alert(error.message || '회복 루틴을 준비하지 못했습니다.')
                navigate('/skin')
            } finally {
                setLoading(false)
            }
        }

        loadRoutine()
    }, [navigate])

    const routineSteps = routine?.steps || []

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

    const handleRoutineComplete = async () => {
        try {
            await completeTodaySkinRoutine()
            setStep(3)
        } catch (error) {
            console.error('회복 루틴 완료 처리 실패:', error)
            alert(error.message || '회복 루틴 완료 처리에 실패했습니다.')
        }
    }

    const handleRecoveryFinish = () => navigate('/skin')

    const matchedProduct = createMatchedProduct(routineSteps[0])
    const matchedProduct02 = createMatchedProduct(routineSteps[1])

    if (loading || !routine) {
        return (
            <div className="page recovery_wrap">
                <p>회복 루틴을 준비하고 있어요.</p>
            </div>
        )
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
                        <p className="recovery_top_2">오늘은 {routineSteps.length}단계로<br />회복 모드를 안내해드릴게요.</p>
                        <p className="recovery_top_3">
                            {routine.summaryComment ||
                                '오늘의 피부 상태에 맞는 회복 루틴을 준비했어요.'}
                        </p>
                    </div>

                    <div className="recovery_step_list">

                        <div className="recovery_step">
                            <img src={RecoveryIcon01} alt="" />
                            <div className="recovery_step_content">
                                <div className="recovery_step_title">
                                    <span>STEP 1</span>
                                    <p>{routineSteps[0]?.careTypeKr || routineSteps[0]?.title || '진정'}</p>
                                </div>
                                <p>
                                    {routineSteps[0]?.title ||
                                        '피부를 외부 자극으로부터 가라앉혀요.'}
                                </p>
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
                                    <p>{routineSteps[1]?.careTypeKr || routineSteps[1]?.title || '보습'}</p>
                                </div>
                                <p>
                                    {routineSteps[1]?.title ||
                                        '수분을 채워 피부 장벽을 보호해요.'}
                                </p>
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
                    stepData={routineSteps[0]}
                    nextStepData={routineSteps[1]}
                />
            )}

            {step === 2 && (
                <Recovery02
                    matchedProduct={matchedProduct02}
                    stepData={routineSteps[1]}
                    previousStepData={routineSteps[0]}
                    onComplete={handleRoutineComplete}
                />
            )}

            {step === 3 && (
                <Recovery03 onComplete={handleRecoveryFinish} />
            )}

        </div>
    )
}

export default Recovery
