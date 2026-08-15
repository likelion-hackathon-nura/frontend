import React from 'react'

import './Recovery02.css'

import CheckWhite02 from '../../../assets/images/check_white_2.svg'
import CheckTip from '../../../assets/images/recovery_check_icon.svg'
import TitleLine from '../../../assets/images/recovery_title_icon.svg'

const Recovery02 = ({ matchedProduct, onComplete }) => {
    return (
        <div className="recovery02_wrap">

            <div className="recovery02_progress">
                <div className="recovery02_progress_step active">
                    <span>
                        <img src={CheckWhite02} alt="진정 단계 완료" />
                    </span>
                    <p>진정</p>
                </div>

                <div className="recovery02_progress_line" />

                <div className="recovery02_progress_step active">
                    <span>2</span>
                    <p>보습</p>
                </div>
            </div>

            <div className="recovery02_top">
                <div className="recovery02_title">
                    <span>STEP 2</span>
                    <p>수분을 채워 피부를 보호해주세요.</p>
                </div>

                <p className="recovery02_content01">
                    진정 단계를 마쳤다면 이제 피부에 공급한<br />
                    수분이 쉽게 빠져나가지 않도록 보호하는 단계예요.
                </p>

                <p className="recovery02_content02">
                    피부 표면을 촉촉하게 유지하고 편안한 상태를<br />
                    오래 유지할 수 있도록 보습 중심의 케어를 추천드려요.
                </p>
            </div>

            <div className="recovery02_main">

                <section className="recovery02_section">
                    <div className="recovery_s_top">
                        <img src={TitleLine} alt="" />
                        <p>추천 성분</p>
                    </div>

                    <p className="recovery02_section_description">
                        피부 속 수분을 유지하고 당김을 완화하는 데 도움이 되는 성분이에요.
                    </p>

                    <div className="recovery02_tags">
                        <span>세라마이드</span>
                        <span>히알루론산</span>
                        <span>스쿠알란</span>
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

                                <div className="recovery_product_box">
                                    <img src={CheckTip} alt="" />
                                    <span>{matchedProduct.description}</span>
                                </div>

                                <div>
                                    <img src={CheckTip} alt="" />
                                    <span>{matchedProduct.ingredients}</span>
                                </div>
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
                        <div>
                            <img src={CheckTip} alt="" />
                            <p>
                                피부가 아직 촉촉할 때 바르면 보습 효과를 오래<br />
                                유지할 수 있어요.
                            </p>
                        </div>

                        <div>
                            <img src={CheckTip} alt="" />
                            <p>
                                양 볼과 입가처럼 당김이 심한 부위는 한 번 더 얇게<br />
                                덧발라주세요.
                            </p>
                        </div>

                        <div>
                            <img src={CheckTip} alt="" />
                            <p>
                                손바닥으로 가볍게 눌러주면 흡수에 도움이 됩니다.
                            </p>
                        </div>
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
