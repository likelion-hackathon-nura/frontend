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
import RecoveryIcon01 from '../../assets/images/recovery_icon_1.png'
import RecoveryIcon02 from '../../assets/images/recovery_icon_2.png'
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

const RECOVERY_STEP_IMAGES = [
    RecoveryIcon01,
    RecoveryIcon02,
]

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

    const [stepImages] = useState(() =>
        Array.from(
            { length: 3 },
            () =>
                RECOVERY_STEP_IMAGES[
                Math.floor(Math.random() * RECOVERY_STEP_IMAGES.length)
                ]
        )
    )

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

    const routineSteps = (routine?.steps || []).slice(0, 3)
    const completionStep = routineSteps.length + 1

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
            setStep(completionStep)
        } catch (error) {
            console.error('회복 루틴 완료 처리 실패:', error)
            alert(error.message || '회복 루틴 완료 처리에 실패했습니다.')
        }
    }

    const handleRecoveryFinish = () => navigate('/skin')

    const isRoutineStep =
        step >= 1 && step <= routineSteps.length

    const currentStepData = routineSteps[step - 1]

    const matchedProduct = createMatchedProduct(currentStepData)

    if (loading || !routine) {
        return (
            <div className="page recovery_wrap">
                <p>회복 루틴을 준비하고 있어요.</p>
            </div>
        )
    }

    return (
        <div className="page recovery_wrap">
            {step < completionStep && (
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
                        {routineSteps.map((routineStep, index) => (
                            <React.Fragment
                                key={routineStep.stepOrder ?? index}
                            >
                                <div className="recovery_step">
                                    <img
                                        src={stepImages[index]}
                                        alt=""
                                    />

                                    <div className="recovery_step_content">
                                        <div className="recovery_step_title">
                                            <span>
                                                STEP {routineStep.stepOrder || index + 1}
                                            </span>

                                            <p>
                                                {routineStep.careTypeKr ||
                                                    routineStep.careType ||
                                                    `맞춤 케어 ${index + 1}`}
                                            </p>
                                        </div>

                                        <p>
                                            {routineStep.title ||
                                                routineStep.description ||
                                                '오늘의 피부 상태에 맞는 케어를 진행해요.'}
                                        </p>
                                    </div>

                                    <div className="recovery_step_time">
                                        <img src={RecoveryTime} alt="" />
                                        <p>1M</p>
                                    </div>
                                </div>

                                {index < routineSteps.length - 1 && (
                                    <img src={RecoveryLine} alt="" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <button className="recovery_bot_btn" onClick={handleNext}>
                        시작하기
                    </button>
                </>

            )}

            {isRoutineStep && (
                step === routineSteps.length ? (
                    <Recovery02
                        matchedProduct={matchedProduct}
                        stepData={currentStepData}
                        stepNumber={step}
                        routineSteps={routineSteps}
                        onComplete={handleRoutineComplete}
                    />
                ) : (
                    <Recovery01
                        onNext={handleNext}
                        matchedProduct={matchedProduct}
                        stepData={currentStepData}
                        stepNumber={step}
                        routineSteps={routineSteps}
                    />
                )
            )}

            {step === completionStep && (
                <Recovery03 onComplete={handleRecoveryFinish} />
            )}

        </div>
    )
}

export default Recovery
