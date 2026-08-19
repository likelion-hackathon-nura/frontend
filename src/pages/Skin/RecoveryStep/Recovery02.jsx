import React from 'react'

import './Recovery02.css'

import CheckWhite02 from '../../../assets/images/check_white_2.svg'
import CheckTip from '../../../assets/images/recovery_check_icon.svg'
import TitleLine from '../../../assets/images/recovery_title_icon.svg'

const Recovery02 = ({ matchedProduct, onComplete, stepData, previousStepData, }) => {

    const ingredients = (() => {
        const value = stepData?.recommendedIngredients

        if (!value) {
            return ['세라마이드', '히알루론산', '스쿠알란']
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

        return ['세라마이드', '히알루론산', '스쿠알란']
    })()

    const precautions = Array.isArray(stepData?.precautions)
        ? stepData.precautions
        : stepData?.precautions
            ? stepData.precautions
                .split(/\n+|•/)
                .map(precaution => precaution.trim())
                .filter(Boolean)
            : [
                '피부가 아직 촉촉할 때 바르면 보습 효과를 오래 유지할 수 있어요.',
                '양 볼과 입가처럼 당김이 심한 부위는 한 번 더 얇게 덧발라주세요.',
                '손바닥으로 가볍게 눌러주면 흡수에 도움이 됩니다.',
            ]


    return (
        <div className="recovery02_wrap">

            <div className="recovery02_progress">
                <div className="recovery02_progress_step active">
                    <span>
                        <img src={CheckWhite02} alt="진정 단계 완료" />
                    </span>
                    <p>
                        {previousStepData?.careTypeKr ||
                            previousStepData?.title ||
                            '진정'}
                    </p>
                </div>

                <div className="recovery02_progress_line" />

                <div className="recovery02_progress_step active">
                    <span>2</span>
                    <p>
                        {stepData?.careTypeKr ||
                            stepData?.title ||
                            '보습'}
                    </p>
                </div>
            </div>

            <div className="recovery02_top">
                <div className="recovery02_title">
                    <span>STEP {stepData?.stepOrder || 2}</span>
                    <p>{stepData?.title || '수분을 채워 피부를 보호해주세요.'}</p>
                </div>

                <p className="recovery02_content01">
                    {stepData?.reason ||
                        '첫 번째 단계 이후 피부 보호를 위한 추가 관리가 필요해요.'}
                </p>

                <p className="recovery02_content02">
                    {stepData?.description ||
                        '피부를 편안한 상태로 유지할 수 있도록 보습 중심의 케어를 진행해주세요.'}
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
                            '피부 속 수분을 유지하고 당김을 완화하는 데 도움이 되는 성분이에요.'}
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
