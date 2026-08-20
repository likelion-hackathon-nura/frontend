import React from 'react'

import './Recovery02.css'

import CheckWhite02 from '../../../assets/images/check_white_2.svg'
import CheckTip from '../../../assets/images/recovery_check_icon.svg'
import TitleLine from '../../../assets/images/recovery_title_icon.svg'

const Recovery02 = ({
    matchedProduct,
    onComplete,
    stepData,
    stepNumber,
    routineSteps,
}) => {

    const ingredients = (() => {
        const value = stepData?.recommendedIngredients

        if (!value) {
            return []
        }

        if (Array.isArray(value)) return value

        try {
            const parsedIngredients = JSON.parse(value)

            if (Array.isArray(parsedIngredients)) {
                return parsedIngredients
            }
        } catch {
            return value
                .replace(/[[\]"]/g, '')
                .split(/[,;|]/)
                .map(ingredient => ingredient.trim())
                .filter(Boolean)
        }

        return []
    })()

    const precautions = Array.isArray(stepData?.precautions)
        ? stepData.precautions
        : stepData?.precautions
            ? stepData.precautions
                .split(/\n+|•/)
                .map(precaution => precaution.trim())
                .filter(Boolean)
            : [
                '제품 사용 중 피부에 이상이 느껴지면 사용을 중단해주세요.',
            ]


    return (
        <div className="recovery02_wrap">

            <div className="recovery02_progress">
                {routineSteps.map((routineStep, index) => {
                    const number = index + 1
                    const isCompleted = number < stepNumber
                    const isActive = number <= stepNumber

                    return (
                        <React.Fragment
                            key={routineStep.stepOrder ?? index}
                        >
                            {index > 0 && (
                                <div
                                    className={`recovery02_progress_line ${number <= stepNumber ? 'active' : ''
                                        }`}
                                />
                            )}

                            <div
                                className={`recovery02_progress_step ${isActive ? 'active' : ''
                                    }`}
                            >
                                <span>
                                    {isCompleted ? (
                                        <img
                                            src={CheckWhite02}
                                            alt="이전 단계 완료"
                                        />
                                    ) : (
                                        number
                                    )}
                                </span>

                                <p>
                                    {routineStep.careTypeKr ||
                                        routineStep.careType ||
                                        `케어 ${number}`}
                                </p>
                            </div>
                        </React.Fragment>
                    )
                })}
            </div>

            <div className="recovery02_top">
                <div className="recovery02_title">
                    <span>STEP {stepData?.stepOrder || stepNumber}</span>
                    <p>{stepData?.title || '오늘의 피부 상태에 맞는 케어를 진행해볼게요.'}</p>
                </div>

                <p className="recovery02_content01">
                    {stepData?.reason ||
                        '이전 단계에 이어 현재 피부에 필요한 케어를 추천했어요.'}
                </p>

                <p className="recovery02_content02">
                    {stepData?.description ||
                        '안내된 방법에 따라 부드럽게 케어를 진행해주세요.'}
                </p>
            </div>

            <div className="recovery02_main">

                <section className="recovery02_section">
                    <div className="recovery_s_top">
                        <img src={TitleLine} alt="" />
                        <p>추천 성분</p>
                    </div>

                    <p className="recovery02_section_description">
                        {stepData?.recommendedIngredientDescription ||
                            '현재 피부 상태에 맞춰 추천하는 성분이에요.'}
                    </p>

                    <div className="recovery02_tags">
                        {ingredients.map((ingredient, index) => (
                            <span key={`${ingredient}-${index}`}>
                                {ingredient}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="recovery02_section02">
                    <div className="recovery_s_top">
                        <img src={TitleLine} alt="" />
                        <p>사용할 제품</p>
                    </div>

                    <p className="recovery02_section_description">
                        {matchedProduct
                            ? '등록하신 제품 안에서 추천해드릴게요.'
                            : '등록하신 제품 중에서 맞는 제품을 찾을 수 없어요.'}
                    </p>

                    {matchedProduct && (
                        <div className="recovery02_product">
                            <div className="recovery02_product_image">
                                <img
                                    src={matchedProduct.image}
                                    alt={matchedProduct.name}
                                />
                            </div>

                            <div className="recovery02_product_content">
                                <p>{matchedProduct.name}</p>

                                {matchedProduct.description && (
                                    <div className="recovery_product_box">
                                        <img src={CheckTip} alt="" />
                                        <span>{matchedProduct.description}</span>
                                    </div>
                                )}

                                {matchedProduct.ingredients && (
                                    <div>
                                        <img src={CheckTip} alt="" />
                                        <span>{matchedProduct.ingredients}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                <section className="recovery02_section02">
                    <div className="recovery_s_top">
                        <img src={TitleLine} alt="" />
                        <p>사용 시 주의사항</p>
                    </div>

                    <div className="recovery02_caution">
                        {precautions.map((precaution, index) => (
                            <div key={`${precaution}-${index}`}>
                                <img src={CheckTip} alt="" />
                                <p>{precaution}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <button
                className="recovery_bot_btn"
                onClick={onComplete}
            >
                완료
            </button>
        </div>
    )
}

export default Recovery02
