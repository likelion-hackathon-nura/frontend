import React from 'react'

import '../Mypage/Mypage.css'

import BottomNav from '../../components/BottomNav/BottomNav'
import ProfileIcon from '../../assets/images/mypage_profile_icon.svg'
import NextArrow from '../../assets/images/next_arrow.svg'

const Mypage = () => {
    return (
        <div className="mypage_wrap">
            <div className="mypage_top">
                <img src={ProfileIcon} alt="" />
                <p>수정</p>
                <span>내 정보 수정</span>
            </div>

            <div className="mypage_line"></div>

            <div className="mypage_main">
                <div className="mypage_m_box01">
                    <p>개인 맞춤 설정</p>
                    <div className="mypage_m_box01_1">
                        <p>🧴 화장품 등록 및 관리</p>
                        <img src={NextArrow} alt="" />
                    </div>
                    <div className="mypage_m_box01_1">
                        <p>ℹ️ 초기 설정 수정</p>
                        <img src={NextArrow} alt="" />
                    </div>
                </div>

                <div className="mypage_m_box02">
                    <p>기타</p>
                    <div className="mypage_m_box02_1">
                        <p>💬 피드백 보내기</p>
                        <img src={NextArrow} alt="" />
                    </div>
                    <div className="mypage_m_box02_1">
                        <p>🚪 로그아웃</p>
                        <img src={NextArrow} alt="" />
                    </div>
                    <div className="mypage_m_box02_1">
                        <p>⛔️ 계정 삭제</p>
                        <img src={NextArrow} alt="" />
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    )
}

export default Mypage
