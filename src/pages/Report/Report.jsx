import React, { useState } from 'react'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from 'recharts';

import './Report.css'
import Comment_logo from '../../assets/images/comment_logo.svg'
import Comment_character from '../../assets/images/comment_character.svg'
import Comment_moon from '../../assets/images/comment_moon.svg'
import Comment_cal from '../../assets/images/comment_cal.svg'
import Comment_heart from '../../assets/images/comment_heart.svg'
import Graph_logo from '../../assets/images/report_graph_logo.svg'
import Graph_icon from '../../assets/images/report_graph_icon.svg'
import Graph_icon2 from '../../assets/images/report_graph_icon2.svg'

const graphData = [
    { day: '월', current: 4.3, previous: 3.0 },
    { day: '화', current: 4.1, previous: 3.3 },
    { day: '수', current: 4.1, previous: 3.1 },
    { day: '목', current: 4.0, previous: 2.9 },
    { day: '금', current: 4.2, previous: 3.2 },
    { day: '토', current: 4.1, previous: 3.1 },
    { day: '일', current: 4.6, previous: 3.4 },
];

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

                                    <div className="report_w_c_title">
                                        <p className='report_w_c_t_1'>이번 주 Refresh Time은</p>
                                        <p className='report_w_c_t_2'>연속 근무 사이의 회복 간격<span>을</span></p>
                                        <p className='report_w_c_t_3'>우선 고려하여 배치했어요.</p>
                                    </div>

                                    <img className="report_w_c_character" src={Comment_character} alt="" />

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
                            <div className="report_w_graph">
                                <p>회복 추세 그래프</p>
                                <div className="report_w_g_box">
                                    <div className="report_w_g_box1">
                                        <p className="report_w_g_unit">(단위 : 시간)</p>
                                        <div className="report_w_g_chart">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart
                                                    data={graphData}
                                                    margin={{
                                                        top: 3,
                                                        right: 20,
                                                        left: -30,
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="2 1"
                                                        vertical={true}
                                                        horizontal={false}
                                                        stroke="#E0E0E0"
                                                        verticalValues={['월', '화', '수', '목', '금', '토', '일']}
                                                    />

                                                    <XAxis
                                                        dataKey="day"
                                                        axisLine={{ stroke: '#CCCCCC' }}
                                                        padding={{ left: 20, right: 20 }}
                                                        tickLine={false}
                                                        tick={{
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            fill: '#747474',
                                                        }}
                                                        dy={8}
                                                    />

                                                    <YAxis
                                                        domain={[0, 6]}
                                                        ticks={[0, 2, 4, 6]}
                                                        axisLine={{ stroke: '#CCCCCC' }}
                                                        tickLine={false}
                                                        tick={{
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                            fill: '#747474',
                                                        }}
                                                    />

                                                    <Line
                                                        type="linear"
                                                        dataKey="current"
                                                        name="이번 주"
                                                        stroke="#FEA1A1"
                                                        strokeWidth={2.3}
                                                        isAnimationActive={false}
                                                        dot={{
                                                            r: 3,
                                                            fill: '#FEA1A1',
                                                            strokeWidth: 0,
                                                        }}
                                                        activeDot={false}
                                                        label={{
                                                            position: 'top',
                                                            fill: '#FEA1A1',
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                        }}
                                                    />

                                                    <Line
                                                        type="linear"
                                                        dataKey="previous"
                                                        name="지난 주"
                                                        stroke="#E7CA94"
                                                        strokeWidth={2.3}
                                                        isAnimationActive={false}
                                                        dot={{
                                                            r: 3,
                                                            fill: '#E7CA94',
                                                            strokeWidth: 0,
                                                        }}
                                                        activeDot={false}
                                                        label={{
                                                            position: 'top',
                                                            fill: '#E7CA94',
                                                            fontSize: 12,
                                                            fontWeight: 400,
                                                        }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="report_w_g_box2">
                                        <div className="report_w_g_box2_1">
                                            <img src={Graph_icon} alt="" className='report_graph_icon' />
                                            <p>이번 주</p>
                                        </div>
                                        <div className="report_w_g_box2_1">
                                            <img src={Graph_icon2} alt="" className='report_graph_icon' />
                                            <p>지난 주</p>
                                        </div>
                                    </div>

                                    <div className="report_w_g_box3">
                                        <img src={Graph_logo} alt="" className='report_graph_logo' />
                                        <div className="report_w_g_box3_txt">
                                            <p className='report_w_g_box3_txt_1'>이번 주 평균 Refresh Time</p>
                                            <div className="report_w_g_box3_txt_df">
                                                <p className='report_w_g_box3_txt_2'><span>4</span>시간 <span>10</span>분</p>
                                                <p className='report_w_g_box3_txt_3'>+20분</p>
                                            </div>
                                            <p className='report_w_g_box3_txt_4'>지난 주보다 20분 더 늘었어요!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="report_w_time">
                                <p>3-Time 밸런스</p>
                                <p>8.21일 기준</p>
                                <div className="report_w_t_box"></div>
                            </div>
                        </div>
                    )}


                    {selectedTab === 'month' && (
                        <div className="report_month">
                            {/* 이번 달 UI 작성 */}
                        </div>
                    )}
                </div>

                <div className="report_footer">
                    <div className="report_footer_circle"></div>
                </div>
            </div>
        </div>
    )
}

export default Report
