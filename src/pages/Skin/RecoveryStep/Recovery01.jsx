import React from 'react'

import './Recovery01.css'

import CheckTip from '../../../assets/images/recovery_check_icon.svg'
import TitleLine from '../../../assets/images/recovery_title_icon.svg'

const Recovery01 = ({ onNext, matchedProduct, stepData, nextStepData, }) => {

    const ingredients = (() => {
        const value = stepData?.recommended_ingredients

        if (!value) {
            return ['병풀추출물(CICA)', '판테놀', '알란토인']
        }

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

        return ['병풀추출물(CICA)', '판테놀', '알란토인']
    })()

    const precautions = stepData?.precautions
        ? stepData.precautions
            .split(/\n+|•/)
            .map(precaution => precaution.trim())
            .filter(Boolean)
        : [
            '피부가 많이 예민한 날에는 문지르기보다 가볍게 눌러 흡수시켜주세요.',
            '세안 후 3분 이내에 사용하면 수분 손실을 줄이는 데 도움이 됩니다.',
            '붉은기가 심한 부위는 얇게 한 번 더 레이어링해도 좋아요.',
        ]


    return (
        <div className="recovery01_wrap">

            <div className="recovery01_progress">
                <div className="recovery01_progress_step active">
                    <span>1</span>
                    <p>{stepData?.title || '진정'}</p>
                </div>

                <div className="recovery01_progress_line" />

                <div className="recovery01_progress_step">
                    <span>2</span>
                    <p>{nextStepData?.title || '보습'}</p>
                </div>
            </div>

            <div className="recovery01_top">
                <div className="recovery01_title">
                    <span>STEP 1</span>
                    <p>{stepData?.title || '먼저 피부 자극을 진정시켜볼게요.'}</p>
                </div>

                <p className="recovery01_content01">
                    {stepData?.reason ||
                        '오늘 체크인 결과를 바탕으로 진정 단계가 필요해요.'}
                </p>

                <p className="recovery01_content02">
                    {stepData?.description ||
                        '피부에 자극을 최소화하면서 진정 중심의 케어를 진행해주세요.'}
                </p>
            </div>

            <div className="recovery01_main">

                <section className="recovery01_section">
                    <div className="recovery_s_top">
                        <img src={TitleLine} alt="" />
                        <p>추천 성분</p>
                    </div>
                    <p className="recovery01_section_description">
                        자극을 완화하고 피부를 편안하게 진정시키는 데 도움이 되는 성분이에요.
                    </p>
                    <div className="recovery01_tags">
                        {ingredients.map((ingredient, index) => (
                            <span key={`${ingredient}-${index}`}>
                                {ingredient}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="recovery01_section02">
                    <div className="recovery_s_top">
                        <img src={TitleLine} alt="" />
                        <p>사용할 제품</p>
                    </div>

                    <p className="recovery01_section_description">
                        {matchedProduct
                            ? '등록하신 제품 안에서 추천해드릴게요.'
                            : '등록하신 제품 중에서 맞는 제품을 찾을 수 없어요.'}
                    </p>

                    {matchedProduct && (

                        <div className="recovery01_product">
                            <div className="recovery01_product_image">
                                <img
                                    src={matchedProduct.image}
                                    alt={matchedProduct.name}
                                />
                            </div>
                            <div className="recovery01_product_content">
                                <p>{matchedProduct.name}</p>

                                <div className='recovery_product_box'>
                                    <img src={CheckTip} alt="" />
                                    <span>{matchedProduct.description}</span>
                                </div>

                                <div >
                                    <img src={CheckTip} alt="" />
                                    <span>{matchedProduct.ingredients}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section className="recovery01_section02">
                    <div className="recovery_s_top">
                        <img src={TitleLine} alt="" />
                        <p>사용 시 주의사항</p>
                    </div>

                    <div className="recovery01_caution">
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
                onClick={onNext}
            >
                다음
            </button>
        </div>
    )
}

export default Recovery01

