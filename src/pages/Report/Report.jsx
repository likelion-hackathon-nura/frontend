import React, { useState } from 'react'
import './Report.css'
import Comment_logo from '../../assets/images/comment_logo.svg'
import Comment_character from '../../assets/images/comment_character.svg'
import Comment_moon from '../../assets/images/comment_moon.svg'
import Comment_cal from '../../assets/images/comment_cal.svg'
import Comment_heart from '../../assets/images/comment_heart.svg'

const Report = () => {

    const [selectedTab, setSelectedTab] = useState('week');

    return (
        <div>
            <div className="page report_wrap">
                <div className="report_top">
                    <div className="report_t_nav">
                        <button className={`report_t_nav_1 ${selectedTab === 'week' ? 'active' : ''}`} onClick={() => setSelectedTab('week')}>
                            이번 주
                        </button>
                        <button className={`report_t_nav_2 ${selectedTab === 'month' ? 'active' : ''}`} onClick={() => setSelectedTab('month')}>
                            이번 달
                        </button>
                    </div>
                </div>

                <div className="report_main">
                    {selectedTab === 'week' && (
                        <div className="report_week">
                            <div className="report_w_comment">
                                <div className="report_w_c_1">
                                    <img src={Comment_logo} alt="" />
                                    <p>NURA AI 코멘트</p>
                                </div>
                                <div className="report_w_c_2">
                                    {/* 상단 문구 */}
                                    <div className="report_w_c_title">
                                        <p className='report_w_c_t_1'>이번 주 Refresh Time은</p>
                                        <p className='report_w_c_t_2'>연속 근무 사이의 회복 간격<span>을</span></p>
                                        <p className='report_w_c_t_3'>우선 고려하여 배치했어요.</p>
                                    </div>
                                    {/* 오른쪽 캐릭터 이미지 */}
                                    <img className="report_w_c_character" src={Comment_character} alt="" />
                                    {/* 하단 설명 */}
                                    <div className="report_w_c_list">
                                        <div className="report_w_c_item">
                                            <img src={Comment_moon} alt="" />
                                            <p>이번 주는 <span className='comment_purple'>Night 근무가 연속 2회</span> 있어<br />회복 시간이 충분하지 않은 날이 많았어요.</p>
                                        </div>
                                        <div className="report_w_c_item">
                                            <img src={Comment_cal} alt="" />
                                            <p>퇴근 체크인에서 <span className='comment_pink'>피로도 높음과 피부 당김</span>이<br />여러 번 기록되었어요.</p>
                                        </div>
                                        <div className="report_w_c_item">
                                            <img src={Comment_heart} alt="" />
                                            <p>사람들과의 시간은 충분히 확보되어 있어<br />이번 주는 <span className='comment_purple'>Refresh Time을 우선으로 조정</span>했어요.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="report_w_graph"></div>
                            <div className="report_w_time"></div>
                        </div>
                    )}


                    {selectedTab === 'month' && (
                        <div className="report_month">
                            {/* 이번 달 UI 작성 */}
                        </div>
                    )}
                </div>

                <div className="report_footer"></div>
            </div>
        </div>
    )
}

export default Report
