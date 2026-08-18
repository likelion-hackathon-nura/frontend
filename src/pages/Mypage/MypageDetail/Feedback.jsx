import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './Feedback.css'
import { submitScheduleFeedback } from '../../../api/mypage'
import { submitSkinFeedback } from '../../../api/skin'

import PrevBtn from '../../../assets/images/prev_btn.svg'
import FeedbackIcon01 from '../../../assets/images/feedback_icon_1.svg'
import FeedbackIcon02 from '../../../assets/images/feedback_icon_2.svg'
import FeedbackIcon03 from '../../../assets/images/feedback_icon_3.svg'
import FeedbackIcon04 from '../../../assets/images/feedback_icon_4.svg'

const categories = [
    {
        id: 'time',
        icon: FeedbackIcon01,
        title: '시간 배분',
        description: 'Refresh Time / My Time\n비율 및 시간 배분 관련',
    },
    {
        id: 'recovery',
        icon: FeedbackIcon02,
        title: '3분 회복 모드',
        description: '루틴 길이, 단계, 세팅 및\n성분 추천 관련',
    },
    {
        id: 'checkin',
        icon: FeedbackIcon03,
        title: '퇴근 체크인',
        description: '질문 항목, 피로감 및\n알림 관련',
    },
    {
        id: 'other',
        icon: FeedbackIcon04,
        title: '기타',
        description: '기타 개선이 필요한\n모든 부분',
    },
]


const weightOptions = [
    {
        label: '부족했어요',
        value: 'LOW',
    },
    {
        label: '적당했어요',
        value: 'NORMAL',
    },
    {
        label: '많았어요',
        value: 'HIGH',
    },
]


const Feedback = () => {
    const navigate = useNavigate()

    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [timeWeights, setTimeWeights] = useState({
        refresh: '',
        my: '',
    })
    const [opinion, setOpinion] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleCategory = (categoryId) => {
        setSelectedCategory(categoryId)

        if (categoryId !== 'time') {
            setSelectedTime('')
            setTimeWeights({
                refresh: '',
                my: '',
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!selectedCategory) {
            alert('피드백 카테고리를 선택해주세요.')
            return
        }

        if (selectedCategory === 'recovery' && !opinion.trim()) {
            alert('피드백 내용을 입력해주세요.')
            return
        }

        setIsSubmitting(true)

        try {
            if (selectedCategory === 'recovery') {
                await submitSkinFeedback(opinion.trim())
            } else {
                await submitScheduleFeedback({
                    myWeight:
                        selectedCategory === 'time'
                            ? timeWeights.my || null
                            : null,
                    refreshWeight:
                        selectedCategory === 'time'
                            ? timeWeights.refresh || null
                            : null,
                    feedbackContents: opinion.trim(),
                })
            }

            alert('피드백이 등록되었습니다.')
            navigate('/mypage')
        } catch (error) {
            alert(
                error.message ||
                '피드백 등록에 실패했습니다.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="feedback_wrap">

            <div className="feedback_top">
                <button type="button" className="feedback_prev_btn" onClick={() => navigate(-1)}>
                    <img src={PrevBtn} alt="뒤로가기" />
                </button>
                <p>피드백 보내기</p>
            </div>

            <form className="feedback_form" onSubmit={handleSubmit}>
                <div className="feedback_section">
                    <div className="feedback_section_title">
                        <p>피드백 카테고리 선택</p>
                        <span>
                            해당되는 항목을 선택해주세요.
                        </span>
                    </div>

                    <div className="feedback_category_list">
                        {categories.map((category) => (
                            <button
                                type="button"
                                key={category.id}
                                className={
                                    selectedCategory === category.id
                                        ? 'feedback_category active'
                                        : 'feedback_category'
                                }
                                onClick={() =>
                                    handleCategory(category.id)
                                }
                            >
                                <img
                                    className="feedback_category_icon"
                                    src={category.icon}
                                    alt=""
                                />

                                <span className="feedback_category_text">
                                    <strong>{category.title}</strong>

                                    <small>
                                        {category.description}
                                    </small>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedCategory === 'time' && (
                    <div className="feedback_section feedback_weight">
                        <div className="feedback_section_title">
                            <p>가중치 조절</p>

                            <span>
                                앞으로 시간 배분 시 원하는 방향을
                                선택해주세요.
                            </span>
                        </div>

                        <div className="feedback_time_buttons">
                            <button
                                type="button"
                                className={
                                    selectedTime === 'refresh'
                                        ? 'active'
                                        : ''
                                }
                                onClick={() =>
                                    setSelectedTime('refresh')
                                }
                            >
                                Refresh Time
                            </button>

                            <button
                                type="button"
                                className={
                                    selectedTime === 'my'
                                        ? 'active'
                                        : ''
                                }
                                onClick={() =>
                                    setSelectedTime('my')
                                }
                            >
                                My Time
                            </button>
                        </div>

                        <p className="feedback_adjustment_title">
                            오늘 Refresh/My Time은 어땠나요?
                        </p>

                        <div className="feedback_adjustment_buttons">
                            {weightOptions.map((option) => (
                                <button
                                    type="button"
                                    key={option.value}
                                    disabled={!selectedTime}
                                    className={
                                        timeWeights[selectedTime] === option.value
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() =>
                                        setTimeWeights((prev) => ({
                                            ...prev,
                                            [selectedTime]: option.value,
                                        }))
                                    }
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="feedback_section feedback_opinion">
                    <div className="feedback_section_title">
                        <p>의견 작성</p>

                        <span>
                            더 자세한 의견을 자유롭게 남겨주세요.
                        </span>
                    </div>

                    <div className="feedback_textarea_wrap">
                        <textarea
                            value={opinion}
                            maxLength={500}
                            placeholder="예) 퇴근 후 Refresh Time을 조금 더 길게 잡아주세요. 루틴 단계가 너무 길어요."
                            onChange={(e) =>
                                setOpinion(e.target.value)
                            }
                        />

                        <span className="feedback_count">
                            {opinion.length}/500자
                        </span>
                    </div>
                </div>

                <div className="feedback_submit_area">
                    <button
                        type="submit"
                        className="feedback_submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '전송 중...' : '완료'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Feedback
