import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './BottomNav.css'
import Home_icon from '../../assets/images/home_icon.svg'
import Home_active_icon from '../../assets/images/home_active_icon.svg'
import Report_icon from '../../assets/images/report_icon.svg'
import Report_active_icon from '../../assets/images/report_active_icon.svg'
import Skin_icon from '../../assets/images/skin_icon.svg'
import Skin_active_icon from '../../assets/images/skin_active_icon.svg'
import Mypage_icon from '../../assets/images/mypage_icon.svg'
import Mypage_active_icon from '../../assets/images/mypage_active_icon.svg'

const BottomNav = () => {

  const location = useLocation()
  const navigate = useNavigate()

  // 경로는 각자 수정할 것
  const HOME_PATH = '/home'
  const REPORT_PATH = '/report'
  const SKIN_PATH = '/skin'
  const MY_PATH = '/mypage'

  return (
    <div>
      <div className="BottomNav_wrap">

        <button type="button" className="bottom_nav_item" onClick={() => navigate(HOME_PATH)}>
          <img src={location.pathname === HOME_PATH ? Home_active_icon : Home_icon} alt="" className="bottom_nav_icon" />
          <p>홈</p>
        </button>

        <button type="button" className="bottom_nav_item" onClick={() => navigate(REPORT_PATH)}>
          <img src={location.pathname === REPORT_PATH ? Report_active_icon : Report_icon} alt="" className="bottom_nav_icon" />
          <p>리포트</p>
        </button>

        {/* 화면 구현 후 이동 기능 추가하기 */}
        <button type="button" className="bottom_nav_plus" aria-label="회복 체크">
          <div className="bottom_nav_plus_icon"></div>
        </button>

        <button type="button" className="bottom_nav_item" onClick={() => navigate(SKIN_PATH)} >
          <img src={location.pathname === SKIN_PATH ? Skin_active_icon : Skin_icon} alt="" className="bottom_nav_icon" />
          <p>피부</p>
        </button>

        <button type="button" className="bottom_nav_item" onClick={() => navigate(MY_PATH)}>
          <img src={location.pathname === MY_PATH ? Mypage_active_icon : Mypage_icon} alt="" className="bottom_nav_icon" />
          <p>마이</p>
        </button>


      </div>
    </div>
  )
}

export default BottomNav
