import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav/BottomNav'

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
import Product01 from '../../assets/images/skin_product_1.svg'
import Product02 from '../../assets/images/skin_product_2.svg'
import SkinTime from '../../assets/images/skin_time.svg'
import SkinLock from '../../assets/images/skin_lock_icon.svg'



const Skin = () => {

    const [isCheckedIn, setIsCheckedIn] = useState(true) //추후 수정 필요
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

    const weekData = [
        { day: '월', status: 'missed' },
        { day: '화', status: 'completed' },
        { day: '수', status: 'completed' },
        { day: '목', status: 'completed' },
        { day: '금', status: 'none' },
        { day: '토', status: 'none' },
        { day: '일', status: 'none' },
    ]

    const navigate = useNavigate()

    const goToCheckIn = () => {
        navigate('/checkin')
    }
    const goToRecovery = () => {
        navigate('/recovery')
    }

    // 1: 진정 케어, 2: 보습 케어, 3: 완료
    const [currentStep, setCurrentStep] = useState(2)

    const recoverySteps = ['진정 케어', '보습 케어', '완료']

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
                        <span>연속 기록 3일 째</span>
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
                                            <p>4/5</p>
                                        </div>
                                        <div className="skin_a_status_box">
                                            <p>피부 당김</p>
                                            <img src={Status02} alt="" />
                                            <p>높음</p>
                                        </div>
                                        <div className="skin_a_status_box">
                                            <p>붉은기/트러블</p>
                                            <img src={Status03} alt="" />
                                            <p>보통</p>
                                        </div>
                                        <div className="skin_a_status_box">
                                            <p>수분도</p>
                                            <img src={Status04} alt="" />
                                            <p>낮음</p>
                                        </div>
                                        <div className="skin_a_status_box">
                                            <p>유분기</p>
                                            <img src={Status05} alt="" />
                                            <p>보통</p>
                                        </div>
                                    </div>

                                    <div className="skin_analysis_photo">
                                        <img src={Line} alt="" className='skin_line' />
                                        <div className="skin_analysis_p_title">
                                            <p>사진 분석 결과</p>
                                            <span>조명과 각도에 따라 차이가 있을 수 있어요.</span>
                                        </div>

                                        <div className="skin_analysis_p_txt">

                                            <div className="skin_a_p_t_box">
                                                <div className="skin_a_p_t_title">
                                                    <img src={Analysis01} alt="" />
                                                    <p>붉은기</p>
                                                    <img src={Analysis02} alt="" />
                                                </div>
                                                <div className="skin_a_p_t_content">
                                                    <p>볼 부위에 일시적인 붉은기가 감지되었어요.<br /><span>마스크나 외부 자극의 영향일 수 있어요.</span></p>
                                                </div>
                                            </div>

                                            <div className="skin_a_p_t_box">
                                                <div className="skin_a_p_t_title">
                                                    <img src={Analysis01} alt="" />
                                                    <p>수분 부족</p>
                                                    <img src={Analysis02} alt="" />
                                                </div>
                                                <div className="skin_a_p_t_content">
                                                    <p>수분도가 평소보다 낮게 측정되었어요.<br /><span>속보습 케어가 필요한 상태예요.</span></p>
                                                </div>
                                            </div>
                                            <div className="skin_a_p_t_box">
                                                <div className="skin_a_p_t_title">
                                                    <img src={Analysis01} alt="" />
                                                    <p>트러블 징후</p>
                                                    <img src={Analysis03} alt="" />
                                                </div>
                                                <div className="skin_a_p_t_content">
                                                    <p>현재 보이는 트러블은 크지 않아요.<br /><span>청결과 보습 관리를 유지해 주세요.</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="skin_ai_comment">
                                        <div className="skin_ai_c_title">
                                            <img src={AiComment} alt="" />
                                            <p>AI 코멘트</p>
                                        </div>

                                        <div className="skin_ai_c_content">
                                            <p>오늘 기록과 피부 사진을 함께 분석한 결과, <span>피부 피로도가 높아지면서 수분 밸런스가 일시적으로 무너진 상태</span>로 보여요.<br />볼 부위의 붉은기는 일시적인 자극으로 보이며, 피부 당김과 함께 나타난 것으로 보아 피부 장벽이 평소보다 예민해졌을 가능성이 있어요. 다행히 트러블 징후는 크지 않아 진정과 충분한 보습만으로도 회복을 기대할 수 있는 상태입니다.</p>
                                            <br /><span>오늘의 분석 결과는 내일 Refresh Time을 조정하고 회복 루틴을 추천하는 데 함께 반영될 예정이에요. 😊</span>
                                        </div>

                                        <div className="skin_ai_c_tag">
                                            <p className='skin_ai_c_t_box'>🌙연속 근무 피로 누적</p>
                                            <p className='skin_ai_c_t_box'>🌿진정과 보습 중심</p>
                                        </div>
                                    </div>
                                </div>

                                {/* =====================2페이지: 3분 회복 모드===================== */}
                                <div className="skin_recovery">

                                    <div className="skin_recovery_top">
                                        <div className="skin_r_t_box">
                                            <p>3분 회복 모드</p>
                                            <span>완료</span>
                                        </div>
                                        <p className='skin_r_t_txt'>2단계 루틴으로 피부 회복을 진행했어요.</p>
                                    </div>

                                    <div className="skin_recovery_progress">
                                        <div className="skin_progress_line">
                                            <span
                                                style={{
                                                    width: `${((currentStep - 1) / (recoverySteps.length - 1)) * 100}%`
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
                                            <div className="skin_product">
                                                <img src={Product01} alt="" />
                                                <div className="skin_p_box">
                                                    <div className="skin_p_b_title">
                                                        <span>STEP 1</span>
                                                        <p>마일드 시카 세럼</p>
                                                    </div>
                                                    <p className='skin_p_b_content'>민감한 피부 보호 | 병풀추출물, 판테놀 함유</p>
                                                </div>
                                                <div className="skin_p_time">
                                                    <img src={SkinTime} alt="" />
                                                    <p>1M</p>
                                                </div>
                                            </div>

                                            <div className="skin_product">
                                                <img src={Product02} alt="" />
                                                <div className="skin_p_box">
                                                    <div className="skin_p_b_title">
                                                        <span>STEP 2</span>
                                                        <p>세라마이드 수분 크림</p>
                                                    </div>
                                                    <p className='skin_p_b_content'>장벽 보호 | 속 수분 유지 | 히알루론산 함유</p>
                                                </div>
                                                <div className="skin_p_time">
                                                    <img src={SkinTime} alt="" />
                                                    <p>1M</p>
                                                </div>
                                            </div>
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
