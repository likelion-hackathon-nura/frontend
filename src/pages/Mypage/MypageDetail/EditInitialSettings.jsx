import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './EditInitialSettings.css'
import {
    getMyPreferences,
    updateMyPreferences,
} from '../../../api/mypage'

import PrevBtn from '../../../assets/images/prev_btn.svg'
import { ReactComponent as RegularIcon } from '../../../assets/images/regular.svg'
import { ReactComponent as SometimesSkipIcon } from '../../../assets/images/sometimes-skip.svg'
import { ReactComponent as OftenSkipIcon } from '../../../assets/images/often-skip.svg'

const SLEEP_MIN = 4
const SLEEP_MAX = 10

const mealPatterns = [
    {
        id: 'REGULAR',
        Icon: RegularIcon,
        title: '규칙적으로 식사해요.',
        description: '거의 매일 3끼를 챙겨 먹어요.',
    },
    {
        id: 'SOMETIMES_SKIP',
        Icon: SometimesSkipIcon,
        title: '가끔 거르기도 해요.',
        description: '바쁘면 한 끼를 거르기도 해요.',
    },
    {
        id: 'OFTEN_SKIP',
        Icon: OftenSkipIcon,
        title: '자주 거르는 편이에요',
        description: '불규칙하거나 거르는 날이 많아요.',
    },
]

const activities = [
    {
        id: 'NAP_SLEEP',
        icon: '💤',
        label: '낮잠/수면',
        iconBackground: '#C2D4FF'
    },
    {
        id: 'BATH',
        icon: '🛀🏻',
        label: '목욕/반신욕',
        iconBackground: '#FFEAD9'
    },
    {
        id: 'READING_STUDY',
        icon: '📕',
        label: '독서/공부',
        iconBackground: '#FFD9DD'
    },
    {
        id: 'EXERCISE_STRETCH',
        icon: '🏀',
        label: '운동/스트레칭',
        iconBackground: '#FFBEA7'
    },
    {
        id: 'PET_CARE',
        icon: '🐶',
        label: '반려동물 케어',
        iconBackground: '#D3C9F0'
    },
    {
        id: 'WALK_CAFE',
        icon: '🚶🏻‍♀️',
        label: '산책/카페',
        iconBackground: '#D9FFDB'
    },
    {
        id: 'MEDITATION',
        icon: '🧘🏻‍♀️',
        label: '명상/요가',
        iconBackground: '#FFF5D9'
    },
    {
        id: 'OTHER',
        icon: '•••',
        label: '기타',
        iconBackground: '#D8D8E6'
    },
]

const sensitivities = [
    {
        id: 'LOW',
        icon: '🌱',
        title: '1단계',
        description: '기본 관리만 해도 괜찮아요.',
    },
    {
        id: 'MEDIUM',
        icon: '🪴',
        title: '2단계',
        description: '적당히 신경 쓰며 관리하고 싶어요.',
    },
    {
        id: 'HIGH',
        icon: '🌲',
        title: '3단계',
        description: '최대한 꼼꼼하게 관리하고 싶어요.',
    },
]

const skinTypes = [
    { id: 'DRY', label: '건성' },
    { id: 'OILY', label: '지성' },
    { id: 'COMBINATION', label: '복합성' },
    { id: 'SENSITIVE', label: '민감성' },
]

const skinConcerns = [
    { id: 'DRYNESS', label: '건조함' },
    { id: 'REDNESS', label: '붉은기' },
    { id: 'TROUBLE', label: '트러블' },
    { id: 'SKIN_BARRIER', label: '피부장벽' },
    { id: 'ROUGHNESS', label: '각질/거칠음' },
    { id: 'OILINESS', label: '피지/유분기' },
    { id: 'WRINKLE', label: '주름' },
    { id: 'OTHER', label: '기타' },
]

const EditInitialSettings = () => {
    const navigate = useNavigate()

    const [sleepTime, setSleepTime] = useState(7)
    const [mealPattern, setMealPattern] = useState('')
    const [selectedActivities, setSelectedActivities] = useState([])
    const [sensitivity, setSensitivity] = useState('')
    const [skinType, setSkinType] = useState('')
    const [selectedConcerns, setSelectedConcerns] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const data = await getMyPreferences()

                setSleepTime(data.targetSleepMinutes / 60)
                setMealPattern(data.mealPattern)
                setSelectedActivities(data.restActivities)
                setSensitivity(data.sensitivityLevel)
                setSkinType(data.skinType)
                setSelectedConcerns(data.skinConcerns)
            } catch (error) {
                alert(
                    error.message ||
                    '초기 설정을 불러오지 못했습니다.'
                )
            } finally {
                setIsLoading(false)
            }
        }

        loadPreferences()
    }, [])

    const sleepProgress =
        ((sleepTime - SLEEP_MIN) / (SLEEP_MAX - SLEEP_MIN)) * 100

    const toggleActivity = (activityId) => {
        if (selectedActivities.includes(activityId)) {
            setSelectedActivities((prev) =>
                prev.filter((id) => id !== activityId)
            )
            return
        }

        if (selectedActivities.length < 3) {
            setSelectedActivities((prev) => [
                ...prev,
                activityId,
            ])
        }
    }

    const toggleConcern = (concern) => {
        if (selectedConcerns.includes(concern)) {
            setSelectedConcerns((prev) =>
                prev.filter((item) => item !== concern)
            )
            return
        }

        if (selectedConcerns.length < 3) {
            setSelectedConcerns((prev) => [
                ...prev,
                concern,
            ])
        }
    }

    const handleSubmit = async () => {
        if (
            !mealPattern ||
            selectedActivities.length === 0 ||
            !sensitivity ||
            !skinType ||
            selectedConcerns.length === 0
        ) {
            alert('모든 초기 설정을 선택해주세요.')
            return
        }

        setIsSubmitting(true)

        try {
            await updateMyPreferences({
                targetSleepMinutes: sleepTime * 60,
                mealPattern,
                restActivities: selectedActivities,
                sensitivityLevel: sensitivity,
                skinType,
                skinConcerns: selectedConcerns,
            })

            alert('초기 설정이 수정되었습니다.')
            navigate('/mypage')
        } catch (error) {
            alert(
                error.message ||
                '초기 설정 수정에 실패했습니다.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="initialsettings_wrap">
                <p>불러오는 중...</p>
            </div>
        )
    }

    return (
        <div className="initialsettings_wrap">
            <div className="initialsettings_top">
                <button type="button" className="initialsettings_prev_btn" onClick={() => navigate(-1)}>
                    <img src={PrevBtn} alt="뒤로가기" />
                </button>
                <p>초기 설정 수정</p>
            </div>

            <div className="initialsettings_section">
                <h2>목표 수면 시간</h2>

                <div className="initialsettings_sleep_card">
                    <p className="initialsettings_sleep_label">
                        하루 최소 목표 수면 시간
                    </p>

                    <div className="initialsettings_sleep_value">
                        <strong>{sleepTime}</strong>
                        <span>시간</span>
                        <strong>00</strong>
                        <span>분</span>
                    </div>

                    <div className="initialsettings_sleep_slider_wrap">
                        <div className="initialsettings_sleep_slider_track">
                            <div
                                className="initialsettings_sleep_slider_fill"
                                style={{ width: `${sleepProgress}%` }}
                            />
                        </div>

                        <div className="initialsettings_sleep_slider_dots">
                            {Array.from(
                                { length: SLEEP_MAX - SLEEP_MIN + 1 },
                                (_, index) => SLEEP_MIN + index
                            ).map((number) => (
                                <span
                                    key={number}
                                    className={
                                        number <= sleepTime
                                            ? 'initialsettings_sleep_slider_dot is-filled'
                                            : 'initialsettings_sleep_slider_dot'
                                    }
                                    style={{
                                        left: `${((number - SLEEP_MIN) /
                                            (SLEEP_MAX - SLEEP_MIN)) *
                                            100
                                            }%`,
                                    }}
                                />
                            ))}
                        </div>

                        <div
                            className="initialsettings_sleep_slider_thumb"
                            style={{ left: `${sleepProgress}%` }}
                        >
                            <span>‹</span>
                            <span>›</span>
                        </div>

                        <input
                            type="range"
                            min={SLEEP_MIN}
                            max={SLEEP_MAX}
                            step={1}
                            value={sleepTime}
                            onChange={(e) =>
                                setSleepTime(Number(e.target.value))
                            }
                            className="initialsettings_sleep_slider"
                            aria-label="목표 수면 시간"
                        />
                    </div>

                    <div className="initialsettings_sleep_slider_ticks">
                        {Array.from(
                            { length: SLEEP_MAX - SLEEP_MIN + 1 },
                            (_, index) => SLEEP_MIN + index
                        ).map((number) => (
                            <span key={number}>{number}</span>
                        ))}
                    </div>
                </div>


                <div className="initialsettings_meal">
                    <div className="initialsettings_title">
                        <h2>식사 패턴</h2>
                        <p>
                            평소 식사 습관과 가장 가까운 것을
                            선택해주세요.
                        </p>
                    </div>

                    <div className="initialsettings_meal_list">
                        {mealPatterns.map((pattern) => (
                            <button
                                type="button"
                                key={pattern.id}
                                className={
                                    mealPattern === pattern.id
                                        ? 'initialsettings_meal_item active'
                                        : 'initialsettings_meal_item'
                                }
                                onClick={() =>
                                    setMealPattern(pattern.id)
                                }
                            >
                                <pattern.Icon className="initialsettings_meal_icon" />

                                <span className="initialsettings_meal_text">
                                    <strong>{pattern.title}</strong>
                                    <small>{pattern.description}</small>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="initialsettings_divider"></div>

                <div className="initialsettings_title">
                    <h2>쉬는 시간에 주로 하는 활동</h2>
                    <p>최대 3개까지 선택할 수 있어요.</p>
                </div>

                <div className="initialsettings_activity_list">
                    {activities.map((activity) => (
                        <button
                            type="button"
                            key={activity.id}
                            className={
                                selectedActivities.includes(
                                    activity.id
                                )
                                    ? 'initialsettings_activity active'
                                    : 'initialsettings_activity'
                            }
                            onClick={() =>
                                toggleActivity(activity.id)
                            }
                        >
                            <span
                                className="initialsettings_activity_icon"
                                style={{
                                    backgroundColor: activity.iconBackground,
                                }}
                            >
                                {activity.icon}
                            </span>
                            {activity.label}
                        </button>
                    ))}
                </div>

                <div className="initialsettings_divider"></div>

                <div className="initialsettings_title">
                    <h2>피부 관리 민감도</h2>
                </div>

                <div className="initialsettings_sensitivity_list">
                    {sensitivities.map((item) => (
                        <button
                            type="button"
                            key={item.id}
                            className={
                                sensitivity === item.id
                                    ? 'initialsettings_sensitivity active'
                                    : 'initialsettings_sensitivity'
                            }
                            onClick={() =>
                                setSensitivity(item.id)
                            }
                        >
                            <span className="initialsettings_sensitivity_icon">
                                {item.icon}
                            </span>

                            <strong>{item.title}</strong>
                            <small>{item.description}</small>
                        </button>
                    ))}
                </div>

                <div className="initialsettings_choice_group">
                    <h2>피부 타입</h2>

                    <div className="initialsettings_choice_list">
                        {skinTypes.map((type) => (
                            <button
                                type="button"
                                key={type.id}
                                className={
                                    skinType === type.id
                                        ? 'initialsettings_choice active'
                                        : 'initialsettings_choice'
                                }
                                onClick={() => setSkinType(type.id)}
                            >
                                {type.label}

                                <span>
                                    {skinType === type.id && '✓'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="initialsettings_choice_group">
                    <div className="initialsettings_title">
                        <h2>피부 고민</h2>
                        <p>최대 3개까지 선택할 수 있어요.</p>
                    </div>

                    <div className="initialsettings_choice_list">
                        {skinConcerns.map((concern) => (
                            <button
                                type="button"
                                key={concern.id}
                                className={
                                    selectedConcerns.includes(concern.id)
                                        ? 'initialsettings_choice active'
                                        : 'initialsettings_choice'
                                }
                                onClick={() =>
                                    toggleConcern(concern.id)
                                }
                            >
                                {concern.label}

                                <span>
                                    {selectedConcerns.includes(concern.id) && '✓'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="initialsettings_submit_area">
                    <button
                        type="button"
                        className="initialsettings_submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '저장 중...' : '완료'}
                    </button>
                </div>
            </div>

        </div >
    )
}

export default EditInitialSettings
