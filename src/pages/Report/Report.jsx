import React, { useEffect, useRef, useState } from 'react'
import BottomNav from '../../components/BottomNav/BottomNav'
import { getWeeklyReport } from '../../api/report'

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
import Social_icon from '../../assets/images/social_icon.svg'
import Refresh_icon from '../../assets/images/refresh_icon.svg'
import Mytime_icon from '../../assets/images/mytime_icon.svg'

const splitHeadline = value => {
    const text = value.trim()
    const prefixMatch = text.match(/^(이번 주 Refresh Time[은을])\s*/)

    if (prefixMatch) {
        const top = prefixMatch[1]
        const rest = text.slice(prefixMatch[0].length).trim()
        const priorityIndex = rest.indexOf('우선 ')

        if (priorityIndex > 0) {
            return {
                top,
                highlight: rest.slice(0, priorityIndex).trim(),
                emphasis: rest.slice(priorityIndex).trim(),
            }
        }

        const words = rest.split(/\s+/)
        const middle = Math.max(1, Math.ceil(words.length / 2))

        return {
            top,
            highlight: words.slice(0, middle).join(' '),
            emphasis: words.slice(middle).join(' '),
        }
    }

    const words = text.split(/\s+/)
    const firstEnd = Math.max(1, Math.round(words.length * 0.3))
    const secondEnd = Math.max(
        firstEnd + 1,
        Math.round(words.length * 0.65)
    )

    return {
        top: words.slice(0, firstEnd).join(' '),
        highlight: words.slice(firstEnd, secondEnd).join(' '),
        emphasis: words.slice(secondEnd).join(' '),
    }
}

const splitParticle = value => {
    const matched = value.match(/^(.*?)([은는이가을를])$/)

    return {
        text: matched?.[1] || value,
        particle: matched?.[2] || '',
    }
}

const COMMENT_ICONS = [
    Comment_moon,
    Comment_cal,
    Comment_heart,
]

const parseRefreshTime = time => {
    const matchedTime = time?.match(/(\d+)시간\s*(\d+)분/)

    return {
        hours: matchedTime?.[1] || 0,
        minutes: matchedTime?.[2] || 0,
    }
}

const Report = () => {

    const [selectedTab, setSelectedTab] = useState('week');

    const requestStarted = useRef(false)
    const [reportData, setReportData] = useState(null)

    useEffect(() => {
        if (requestStarted.current) return
        requestStarted.current = true

        const loadWeeklyReport = async () => {
            try {
                const data = await getWeeklyReport()
                setReportData(data)
            } catch (error) {
                console.error('주간 리포트 조회 실패:', error)
                alert(error.message || '주간 리포트를 불러오지 못했습니다.')
            }
        }

        loadWeeklyReport()
    }, [])

    const aiComment = reportData?.aiComment
    const recoveryTrend = reportData?.recoveryTrend
    const timeBalance = reportData?.threeTimeBalance

    const commentBullets = [
        aiComment?.bullet1,
        aiComment?.bullet2,
        aiComment?.bullet3,
    ].filter(Boolean)

    const headline =
        aiComment?.headline || '이번 주 리포트를 준비하고 있어요.'

    const isGuideComment = headline.startsWith('반가워요!')
    const headlineLines = isGuideComment ? null : splitHeadline(headline)

    const highlightedLine = headlineLines
        ? splitParticle(headlineLines.highlight)
        : null

    const lastWeekByDay = new Map(
        (recoveryTrend?.lastWeek || []).map((item) => [
            item.dayOfWeek,
            item.hours,
        ])
    )

    const graphData = (recoveryTrend?.thisWeek || []).map(item => ({
        day: item.dayOfWeek,
        current: Number(item.hours) || 0,
        previous: Number(lastWeekByDay.get(item.dayOfWeek)) || 0,
    }))

    const graphMaxValue = Math.max(
        0,
        ...graphData.flatMap(item => [item.current, item.previous])
    )

    const yAxisMax = Math.max(
        6,
        Math.ceil((graphMaxValue + 1) / 2) * 2
    )

    const yAxisTicks = Array.from(
        { length: yAxisMax / 2 + 1 },
        (_, index) => index * 2
    )

    const avgRefreshTime = parseRefreshTime(
        recoveryTrend?.averageRefreshTimeText
    )

    const comparisonMinutes = recoveryTrend?.comparisonMinutes
    const comparisonMinutesText = Number.isFinite(comparisonMinutes)
        ? `${comparisonMinutes > 0 ? '+' : ''}${comparisonMinutes}분`
        : ''

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

                                    <div
                                        className={`report_w_c_title ${isGuideComment ? 'guide' : 'analysis'
                                            }`}
                                    >
                                        {isGuideComment ? (
                                            <p className="report_w_c_guide">{headline}</p>
                                        ) : (
                                            <>
                                                <p className="report_w_c_t_1">
                                                    {headlineLines.top}
                                                </p>

                                                {headlineLines.highlight && (
                                                    <p className="report_w_c_t_2">
                                                        {highlightedLine.text}
                                                        <span>{highlightedLine.particle}</span>
                                                    </p>
                                                )}

                                                {headlineLines.emphasis && (
                                                    <p className="report_w_c_t_3">
                                                        {headlineLines.emphasis}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <img className="report_w_c_character" src={Comment_character} alt="" />

                                    <div className="report_w_c_list">
                                        {commentBullets.map((bullet, index) => (
                                            <div
                                                className="report_w_c_item"
                                                key={`${bullet}-${index}`}
                                            >
                                                <img
                                                    src={COMMENT_ICONS[index % COMMENT_ICONS.length]}
                                                    alt=""
                                                />
                                                <p>{bullet}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="report_w_graph">
                                <p>회복 추세 그래프</p>
                                <div className="report_w_g_box">
                                    <div className="report_w_g_box1">
                                        <p className="report_w_g_unit">
                                            (단위 : {recoveryTrend?.unit || '시간'})
                                        </p>
                                        <div className="report_w_g_chart">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart
                                                    data={graphData}
                                                    margin={{
                                                        top: 15,
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
                                                        domain={[0, yAxisMax]}
                                                        ticks={yAxisTicks}
                                                        allowDecimals={false}
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
                                                            offset: 8,
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
                                                            offset: 8,
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
                                                <p className="report_w_g_box3_txt_2">
                                                    <span>{avgRefreshTime.hours}</span>시간{' '}
                                                    <span>{avgRefreshTime.minutes}</span>분
                                                </p>

                                                {comparisonMinutesText && (
                                                    <p className="report_w_g_box3_txt_3">
                                                        {comparisonMinutesText}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="report_w_g_box3_txt_4">
                                                {recoveryTrend?.comparisonText || ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="report_w_time">
                                <div className="report_w_t_txt">
                                    <p>3-Time 밸런스</p>
                                    <p className="report_w_t_txt_2">
                                        {timeBalance?.baseDateText || ''}
                                    </p>
                                </div>

                                <div className="report_w_t_box">
                                    <div className="report_w_t_box_txt">
                                        <img src={Social_icon} alt="" />
                                        <div className="report_w_t_box_txt1">
                                            <p>Social Time</p>
                                            <div className="report_w_t_progress_row">
                                                <div className="report_w_t_progress">
                                                    <div
                                                        className="report_w_t_progress_fill social"
                                                        style={{
                                                            width: `${timeBalance?.socialTimePercent || 0}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="report_w_t_percent social_percent">
                                                    {timeBalance?.socialTimePercent || 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="report_w_t_box_txt">
                                        <img src={Refresh_icon} alt="" />
                                        <div className="report_w_t_box_txt2">
                                            <p>Refresh Time</p>
                                            <div className="report_w_t_progress_row">
                                                <div className="report_w_t_progress">
                                                    <div
                                                        className="report_w_t_progress_fill refresh"
                                                        style={{
                                                            width: `${timeBalance?.refreshTimePercent || 0}%`,
                                                        }}
                                                    />
                                                </div>

                                                <span className="report_w_t_percent">
                                                    {timeBalance?.refreshTimePercent || 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="report_w_t_box_txt">
                                        <img src={Mytime_icon} alt="" />
                                        <div className="report_w_t_box_txt3">
                                            <p>My Time</p>
                                            <div className="report_w_t_progress_row">
                                                <div className="report_w_t_progress">
                                                    <div
                                                        className="report_w_t_progress_fill mytime"
                                                        style={{
                                                            width: `${timeBalance?.myTimePercent || 0}%`,
                                                        }}
                                                    />
                                                </div>

                                                <span className="report_w_t_percent">
                                                    {timeBalance?.myTimePercent || 0}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}


                    {selectedTab === 'month' && (
                        <div className="report_month">
                            {/* 이번 달 UI 작성 */}
                        </div>
                    )}
                </div>

                <BottomNav />
            </div>
        </div>
    )
}

export default Report
