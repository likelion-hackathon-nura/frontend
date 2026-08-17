import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './Mypage.css'
import { logoutUser } from '../../api/mypage'
import { clearTokens } from '../../api/tokenStorage'

import BottomNav from '../../components/BottomNav/BottomNav'
import ProfileIcon from '../../assets/images/mypage_profile_icon.svg'
import NextArrow from '../../assets/images/next_arrow.svg'

const Mypage = () => {

    const navigate = useNavigate()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        if (isLoggingOut) {
            return
        }

        const confirmed = window.confirm(
            '로그아웃하시겠습니까?'
        )

        if (!confirmed) {
            return
        }

        setIsLoggingOut(true)

        try {
            await logoutUser()
            clearTokens()
            alert('로그아웃되었습니다.')
            navigate('/', { replace: true })
        } catch (error) {
            alert(
                error.message ||
                '로그아웃에 실패했습니다.'
            )
        } finally {
            setIsLoggingOut(false)
        }
    }

    return (
        <div className="mypage_wrap">
            <div className="mypage_top">
                <img src={ProfileIcon} alt="" />
                <p>수정</p>
                <span onClick={() => navigate('/mypage/edit-profile')}>내 정보 수정</span>
            </div>

            <div className="mypage_line"></div>

            <div className="mypage_main">
                <div className="mypage_m_box01">
                    <p>개인 맞춤 설정</p>
                    <div className="mypage_m_box01_1" onClick={() => navigate('/mypage/cosmetic-management')}>
                        <p>🧴 화장품 등록 및 관리</p>
                        <img src={NextArrow} alt="" />
                    </div>
                    <div className="mypage_m_box01_1" onClick={() => navigate('/mypage/initial-settings')}>
                        <p>ℹ️ 초기 설정 수정</p>
                        <img src={NextArrow} alt="" />
                    </div>
                </div>

                <div className="mypage_m_box02">
                    <p>기타</p>
                    <div className="mypage_m_box02_1" onClick={() => navigate('/mypage/feedback')}>
                        <p>💬 피드백 보내기</p>
                        <img src={NextArrow} alt="" />
                    </div>
                    <div
                        className="mypage_m_box02_1"
                        onClick={handleLogout}
                    >
                        <p>
                            🚪 {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                        </p>
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
