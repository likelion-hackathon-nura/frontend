import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getTodaySkin } from '../../api/skin'

import '../Skin/Skin.css'

import NextArrow from '../../assets/images/next_arrow.svg'
import CheckIcon from '../../assets/images/check_icon.svg'
import XIcon from '../../assets/images/x_icon.svg'
import Status01 from '../../assets/images/skin_status_1.svg'
import Status02 from '../../assets/images/skin_status_2.svg'
import Status03 from '../../assets/images/skin_status_3.svg'
import Status04 from '../../assets/images/skin_status_4.svg'
import Status05 from '../../assets/images/skin_status_5.svg'
import Analysis01 from '../../assets/images/skin_analysis_1.svg'
import Analysis02 from '../../assets/images/skin_analysis_2.svg'
import Analysis03 from '../../assets/images/skin_analysis_3.svg'
import Line from '../../assets/images/skin_line.svg'
import AiComment from '../../assets/images/comment_logo.svg'
import CheckWhite from '../../assets/images/check_white.svg'
import CheckGreen from '../../assets/images/check_green.svg'
import Product01 from '../../assets/images/recovery_product_1.svg'
import Product02 from '../../assets/images/recovery_product_2.svg'
import Product03 from '../../assets/images/recovery_product_3.svg'
import Product04 from '../../assets/images/recovery_product_4.svg'
import SkinTime from '../../assets/images/skin_time.svg'
import SkinLock from '../../assets/images/skin_lock_icon.svg'


const DAY_LABELS = { MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금', SAT: '토', SUN: '일' }
const PRODUCT_IMAGES = [Product01, Product02, Product03, Product04]
const LEVEL_LABELS = {
    1: '낮음',
    2: '보통',
    3: '높음',
    4: '매우 높음',
    VERY_LOW: '낮음',
    LOW: '낮음',
    MODERATE: '보통',
    MEDIUM: '보통',
    HIGH: '높음',
    UNKNOWN: '분석 전',
}

const getLevelLabel = (...values) => {
    const value = values.find(item =>
        item !== undefined && item !== null && item !== 'UNKNOWN'
    ) ?? values.find(item =>
        item !== undefined && item !== null
    )

    return LEVEL_LABELS[value] || '-'
}

const getAnalysisLevelIcon = level =>
    level === 'HIGH' ? Analysis02 : Analysis03

const Skin = () => {

    const [usedProductImages] = useState(() =>
        [...PRODUCT_IMAGES]
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)
    )

    const [isCheckedIn, setIsCheckedIn] = useState(false)

    const [streakDays, setStreakDays] = useState(0)

    const [checkinSummary, setCheckinSummary] = useState(null)
    const [routineSummary, setRoutineSummary] = useState(null)
    const [isRoutineCompleted, setIsRoutineCompleted] = useState(false)


    useEffect(() => {
        const loadTodaySkin = async () => {
            try {
                const data = await getTodaySkin()
                const routine = data.routineSummary
                const totalSteps = routine?.totalSteps ?? routine?.steps?.length ?? 0
                const routineCompleted = Boolean(data.routineCompleted || routine?.completed)

                setIsCheckedIn(Boolean(data.checkedIn))
                setStreakDays(data.streakDays ?? 0)
                setWeekData(
                    (data.weeklyRecords ?? []).map(item => ({
                        day: DAY_LABELS[item.dayOfWeek],
                        status: item.status?.toLowerCase() || 'none',
                    }))
                )
                setCheckinSummary(data.checkinSummary ?? null)
                setRoutineSummary(routine ?? null)
                setIsRoutineCompleted(routineCompleted)
                setCurrentStep(routineCompleted ? totalSteps + 1 : Math.max(totalSteps, 1))
            } catch (error) {
                console.error('오늘의 피부 상태 조회 실패:', error)
            }
        }

        loadTodaySkin()
    }, [])

    const [currentSlide, setCurrentSlide] = useState(1)
    const [touchStart, setTouchStart] = useState(null)
    const handleTouchStart = (e) => {
        if (!isCheckedIn) return
        setTouchStart(e.touches[0].clientX)
    }
    const handleTouchEnd = (e) => {
        if (!isCheckedIn) return
        if (touchStart === null) return
        const touchEnd = e.changedTouches[0].clientX
        const distance = touchStart - touchEnd
        if (distance > 50) {
            setCurrentSlide(1)
        }
        if (distance < -50) {
            setCurrentSlide(0)
        }
        setTouchStart(null)
    }

    const [weekData, setWeekData] = useState([])

    const navigate = useNavigate()

    const goToCheckIn = () => navigate('/checkin')
    const goToRecovery = () => {
        navigate('/recovery')
    }

    // 1: 진정 케어, 2: 보습 케어, 3: 완료
    const [currentStep, setCurrentStep] = useState(2)

    const routineSteps = routineSummary?.steps ?? []

    const recoverySteps = routineSteps.length
        ? [
            ...routineSteps.map(item =>
                item.careTypeKr || item.careType
            ),
            '완료',
        ]
        : ['진정 케어', '보습 케어', '완료']


    const routineProducts = routineSteps.filter(
        item => item.hasCosmetic || item.cosmeticName
    )

    const analysisDetails = checkinSummary?.analysisDetails ?? []

    return (
        <div className="page skin_wrap">
            <div className="skin_top">오늘의 피부 상태를<br />기록해보세요💧</div>

            <div className="skin_main">

                <div className="skin_main01">
                    <div className="skin_m01_box">
                        <p className='skin_m01_box_1'>퇴근 체크인</p>
                        <p className='skin_m01_box_2'>오늘의 피부 상태와 컨디션을<br />기록하고 맞춤 케어를 받아보세요.</p>
                        <button className='skin_m01_box_3' onClick={goToCheckIn}>체크인하러 가기<img src={NextArrow} alt="" /></button>
                    </div>
                    <div className="skin_m01_box">
                        <p className='skin_m01_box_1'>3분 회복 모드</p>
                        <p className='skin_m01_box_2'>체크인 기록을 바탕으로<br />오늘의 루틴을 제안해드려요.</p>
                        <button className='skin_m01_box_4' onClick={goToRecovery}>회복 모드 시작하기<img src={NextArrow} alt="" /></button>
                    </div>
                </div>

                <div className="skin_main02">
                    <div className="skin_m02_txt">
                        <p>기록을 꾸준히 이어가고 있어요!</p>
                        <span>연속 기록 {streakDays}일 째</span>
                    </div>

                    <div className="skin_week">
                        {weekData.map((item) => (
                            <div className="skin_week_item" key={item.day}>

                                {item.status === 'completed' && (
                                    <img src={CheckIcon} alt="체크인 완료" />
                                )}

                                {item.status === 'missed' && (
                                    <img src={XIcon} alt="체크인 미완료" />
                                )}

                                {item.status === 'none' && (
                                    <div className="skin_week_empty" />
                                )}

                                <span>{item.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="skin_main03">
                    <p className='skin_m03_title'>오늘의 피부 분석 & 회복 모드</p>

                    <div className="skin_result_wrap">
                        {/* =========================슬라이드 영역========================= */}
                        <div
                            className={`skin_result ${!isCheckedIn ? 'blur' : ''}`}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div
                                className="skin_slider"
                                style={{
                                    transform: `translateX(-${currentSlide * 100}%)`
                                }}
                            >
                                {/* =====================1페이지: 오늘의 피부 분석===================== */}
                                <div className="skin_analysis">

                                    <div className="skin_analysis_status">
                                        <div className="skin_a_status_box">
                                            <p>피로도</p>
                                            <img src={Status01} alt="" />
                                            <p>{checkinSummary?.fatigue ?? '-'}/5</p>
                                        </div>
                                        <div className="skin_a_status_box">
                                            <p>피부 당김</p>
                                            <img src={Status02} alt="" />
                                            <p>{getLevelLabel(checkinSummary?.tightness)}</p>
                                        </div>
                                        <div className="skin_a_status_box">
                                            <p>붉은기/트러블</p>
                                            <img src={Status03} alt="" />
                                            <p>
                                                {getLevelLabel(
                                                    checkinSummary?.analyzedRedness,
                                                    checkinSummary?.analyzedTrouble,
                                                    checkinSummary?.redness,
                                                )}
                                            </p>
                                        </div>
                                        <div className="skin_a_status_box">
                                            <p>수분도</p>
                                            <img src={Status04} alt="" />
                                            <p>{getLevelLabel(checkinSummary?.analyzedMoisture)}</p>
                                        </div>
                                        <div className="skin_a_status_box">
                                            <p>유분기</p>
                                            <img src={Status05} alt="" />
                                            <p>{getLevelLabel(checkinSummary?.analyzedOiliness)}</p>
                                        </div>
                                    </div>

                                    <div className="skin_analysis_photo">
                                        <img src={Line} alt="" className='skin_line' />
                                        <div className="skin_analysis_p_title">
                                            <p>사진 분석 결과</p>
                                            <span>조명과 각도에 따라 차이가 있을 수 있어요.</span>
                                        </div>

                                        <div className="skin_analysis_photo_content">
                                            {checkinSummary?.photoUrl && (
                                                <img
                                                    src={checkinSummary.photoUrl}
                                                    alt="오늘의 피부 사진"
                                                    className="skin_analysis_image"
                                                />
                                            )}

                                            <div className="skin_analysis_p_txt">
                                                {analysisDetails.length > 0 ? (
                                                    analysisDetails.map((detail, index) => (
                                                        <div
                                                            className="skin_a_p_t_box"
                                                            key={`${detail.title}-${index}`}
                                                        >
                                                            <div className="skin_a_p_t_title">
                                                                <img src={Analysis01} alt="" />
                                                                <p>{detail.title}</p>
                                                                <img
                                                                    src={getAnalysisLevelIcon(detail.level)}
                                                                    alt=""
                                                                />
                                                            </div>

                                                            <div className="skin_a_p_t_content">
                                                                <p>{detail.description}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="skin_analysis_empty">
                                                        사진 분석 결과를 준비하고 있어요.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="skin_ai_comment">
                                        <div className="skin_ai_c_title">
                                            <img src={AiComment} alt="" />
                                            <p>AI 코멘트</p>
                                        </div>

                                        <div className="skin_ai_c_content">
                                            <p>
                                                {checkinSummary?.aiComment ||
                                                    'AI 코멘트를 준비하고 있어요.'}
                                            </p>
                                        </div>

                                        <div className="skin_ai_c_tag">
                                            {(checkinSummary?.tags ?? []).map((tag, index) => (
                                                <p
                                                    className="skin_ai_c_t_box"
                                                    key={`${tag}-${index}`}
                                                >
                                                    {tag}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* =====================2페이지: 3분 회복 모드===================== */}
                                <div className="skin_recovery">

                                    <div className="skin_recovery_top">
                                        <div className="skin_r_t_box">
                                            <p>3분 회복 모드</p>
                                            <span>{isRoutineCompleted ? '완료' : '진행 중'}</span>
                                        </div>
                                        <p className="skin_r_t_txt">
                                            {routineSummary?.totalSteps ?? routineSteps.length}단계 루틴으로
                                            피부 회복을 {isRoutineCompleted ? '진행했어요.' : '진행 중이에요.'}
                                        </p>
                                    </div>

                                    <div className="skin_recovery_progress">
                                        <div className="skin_progress_line">
                                            <span
                                                style={{
                                                    width: `${Math.min(
                                                        ((currentStep - 1) /
                                                            Math.max(recoverySteps.length - 1, 1)) * 100,
                                                        100
                                                    )}%`
                                                }}
                                            />
                                        </div>
                                        {recoverySteps.map((step, index) => (
                                            <div
                                                key={step}
                                                className={`skin_recovery_step ${index < currentStep ? 'active' : ''
                                                    }`}
                                            >
                                                <span className="skin_recovery_circle">
                                                    <img
                                                        src={index < currentStep ? CheckWhite : CheckGreen}
                                                        alt=""
                                                    />
                                                </span>
                                                <p>{step}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <img src={Line} alt="" className='line' />

                                    <div className="skin_products">
                                        <p className='skin_p_title'>사용한 제품</p>
                                        <div className="skin_product_all">
                                            {routineProducts.length > 0 ? (
                                                routineProducts.map((product, index) => (
                                                    <div
                                                        className="skin_product"
                                                        key={`${product.stepOrder}-${product.cosmeticName}`}
                                                    >
                                                        <img
                                                            src={
                                                                product.cosmeticImageUrl ||
                                                                usedProductImages[
                                                                index % usedProductImages.length
                                                                ]
                                                            }
                                                            alt={product.cosmeticName || '사용한 제품'}
                                                            className="skin_product_image"
                                                        />

                                                        <div className="skin_p_box">
                                                            <div className="skin_p_b_title">
                                                                <span>
                                                                    STEP {product.stepOrder || index + 1}
                                                                </span>
                                                                <p>{product.cosmeticName}</p>
                                                            </div>

                                                            <p className="skin_p_b_content">
                                                                {(product.cosmeticFeatures?.length
                                                                    ? product.cosmeticFeatures
                                                                    : product.recommendedIngredients ?? []
                                                                ).join(' | ')}
                                                            </p>
                                                        </div>

                                                        <div className="skin_p_time">
                                                            <img src={SkinTime} alt="" />
                                                            <p>1M</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="skin_products_empty">
                                                    사용한 제품 정보가 없어요.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <img src={Line} alt="" className='line' />

                                    <div className="skin_recovery_message">
                                        <p>🍵</p>
                                        <p>오늘도 꾸준한 케어로 피부 회복에 한걸음 더 다가갔어요!<br /><span>내일도 함께 관리해 볼까요?</span></p>
                                    </div>

                                    <p className='skin_recovery_message02'>3분 회복 모드 기록은 마이페이지에서 확인할 수 있어요.</p>

                                </div>

                            </div>

                        </div>


                        {/* =========================체크인 전 잠금 화면========================= */}
                        {!isCheckedIn && (
                            <div className="skin_locked_content">
                                <img src={SkinLock} alt="" className='skin_lock_icon' />
                                <p>퇴근 체크인을 완료하면<br />조회하실 수 있어요.</p>
                                <button onClick={goToCheckIn}>체크인하고 결과 보기<img src={NextArrow} alt="" /></button>
                            </div>
                        )}

                    </div>


                    {/* =========================슬라이드 페이지 표시========================= */}
                    <div className="skin_dots">
                        <button
                            type="button"
                            className={currentSlide === 0 ? 'active' : ''}
                            onClick={() => setCurrentSlide(0)}
                            disabled={!isCheckedIn}
                            aria-label="피부 분석 결과 보기"
                        />

                        <button
                            type="button"
                            className={currentSlide === 1 ? 'active' : ''}
                            onClick={() => setCurrentSlide(1)}
                            disabled={!isCheckedIn}
                            aria-label="3분 회복 모드 보기"
                        />
                    </div>

                </div>

            </div>

            <BottomNav />

        </div>
    )
}

export default Skin
