import React, { useState } from 'react'

import './Recovery03.css'

import RecoveryFinIcon from '../../../assets/images/checkin_fin_icon.svg'
import TitleLine from '../../../assets/images/recovery_title_icon.svg'
import NextArrow from '../../../assets/images/recovery_next_arrow.svg'



const Recovery03 = ({ onComplete }) => {
    const [completed, setCompleted] = useState('yes')
    const [condition, setCondition] = useState('')
    const [direction, setDirection] = useState('')
    const [saveMode, setSaveMode] = useState('')

    return (
        <div className="recovery03_wrap">

            <div className="recovery03_top">
                <img src={RecoveryFinIcon} alt="회복 모드 완료" className="recovery03_check" />
                <p className="recovery03_title">3분 회복 모드가 완료되었어요👋🏻</p>
                <p className="recovery03_description">더 나은 회복 루틴을 추천해드릴 수 있도록,<br />현재 상태를 간단히 알려주세요.</p>
            </div>

            <div className="recovery03_main">
                <section className="recovery03_question">

                    <div className="recovery03_q_top">
                        <img src={TitleLine} alt="" />
                        <p>3분 회복 모드를 모두 이행했나요?</p>
                    </div>


                    <div className="recovery03_options">
                        <button
                            type="button"
                            className={completed === 'yes' ? 'active' : ''}
                            onClick={() => setCompleted('yes')}
                        >
                            예
                        </button>

                        <button
                            type="button"
                            className={completed === 'no' ? 'active' : ''}
                            onClick={() => setCompleted('no')}
                        >
                            아니오
                        </button>
                    </div>
                </section>

                <section className="recovery03_question">
                    <div className="recovery03_q_top">
                        <img src={TitleLine} alt="" />
                        <p>현재 상태가 어떤지 체크해주세요.</p>
                    </div>

                    <div className="recovery03_options">
                        <button
                            type="button"
                            className={condition === 'better' ? 'active' : ''}
                            onClick={() => setCondition('better')}
                        >
                            나아짐
                        </button>

                        <button
                            type="button"
                            className={condition === 'same' ? 'active' : ''}
                            onClick={() => setCondition('same')}
                        >
                            그대로
                        </button>

                        <button
                            type="button"
                            className={condition === 'tired' ? 'active' : ''}
                            onClick={() => setCondition('tired')}
                        >
                            더 피곤함
                        </button>
                    </div>
                </section>

                <section className="recovery03_question">
                    <div className="recovery03_q_top">
                        <img src={TitleLine} alt="" />
                        <p>다음 추천에 반영할까요?</p>
                    </div>

                    <div className="recovery03_options">
                        <button
                            type="button"
                            className={direction === 'good' ? 'active' : ''}
                            onClick={() => setDirection('good')}
                        >
                            좋아요
                        </button>

                        <button
                            type="button"
                            className={direction === 'shorter' ? 'active' : ''}
                            onClick={() => setDirection('shorter')}
                        >
                            더 짧게
                        </button>

                        <button
                            type="button"
                            className={direction === 'different' ? 'active' : ''}
                            onClick={() => setDirection('different')}
                        >
                            다른 방식
                        </button>
                    </div>
                </section>

                <section className="recovery03_question">
                    <div className="recovery03_q_top">
                        <img src={TitleLine} alt="" />
                        <p>해당 회복 모드를 스크랩할까요?</p>
                    </div>

                    <p className="recovery03_question_description">
                        스크랩한 루틴은 마이페이지에서 확인하실 수 있어요.
                    </p>

                    <div className="recovery03_options">
                        <button
                            type="button"
                            className={saveMode === 'yes' ? 'active' : ''}
                            onClick={() => setSaveMode('yes')}
                        >
                            예
                        </button>

                        <button
                            type="button"
                            className={saveMode === 'no' ? 'active' : ''}
                            onClick={() => setSaveMode('no')}
                        >
                            아니오
                        </button>
                    </div>
                </section>

                <button
                    type="button"
                    className="recovery03_feedback_btn"
                >
                    피드백 자세히 남기기 <img src={NextArrow} alt="" />
                </button>

                <button
                    type="button"
                    className="recovery03_complete_btn"
                    onClick={() => onComplete(completed)}
                >
                    완료
                </button>
            </div>
        </div>
    )
}

export default Recovery03