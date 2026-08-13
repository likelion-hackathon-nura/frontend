import { useState } from 'react'
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
import { ReactComponent as HomeXIcon } from '../../assets/images/home-x.svg'

const BottomNav = () => {

  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)

  // 경로는 각자 수정할 것
  const HOME_PATH = '/home'
  const REPORT_PATH = '/report'
  const SKIN_PATH = '/skin'
  const MY_PATH = '/mypage'

  return (
    <div>
      {menuOpen && (
        <div
          className="bottom_nav_overlay"
          onClick={() => {
            setMenuOpen(false)
            setWorkOpen(false)
            setScheduleOpen(false)
          }}
        >
          <button
            type="button"
            className="bottom_nav_menu_option"
            onClick={(e) => {
              e.stopPropagation()
              setWorkOpen((open) => !open)
            }}
          >
            근무표 등록하기
          </button>

          {workOpen && (
            <>
              <button
                type="button"
                className="bottom_nav_menu_sub"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate('/work-schedule/scan-loading')
                }}
              >
                사진 업로드하기
              </button>
              <button
                type="button"
                className="bottom_nav_menu_sub"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate('/work-schedule/manual-entry')
                }}
              >
                직접 작성하기
              </button>
              <button type="button" className="bottom_nav_menu_sub" onClick={(e) => e.stopPropagation()}>
                근무표 수정하기
              </button>
            </>
          )}

          <button
            type="button"
            className="bottom_nav_menu_option"
            onClick={(e) => {
              e.stopPropagation()
              setScheduleOpen((open) => !open)
            }}
          >
            일정 관리하기
          </button>

          {scheduleOpen && (
            <>
              <button type="button" className="bottom_nav_menu_sub" onClick={(e) => e.stopPropagation()}>
                일정 추가하기
              </button>
              <button type="button" className="bottom_nav_menu_sub" onClick={(e) => e.stopPropagation()}>
                일정 삭제하기
              </button>
            </>
          )}
        </div>
      )}

      <div className="BottomNav_wrap">

        <button type="button" className="bottom_nav_item" onClick={() => navigate(HOME_PATH)}>
          <img src={location.pathname === HOME_PATH ? Home_active_icon : Home_icon} alt="" className="bottom_nav_icon" />
          <p className={location.pathname === HOME_PATH ? 'is-active' : ''}>홈</p>
        </button>

        <button type="button" className="bottom_nav_item" onClick={() => navigate(REPORT_PATH)}>
          <img src={location.pathname === REPORT_PATH ? Report_active_icon : Report_icon} alt="" className="bottom_nav_icon" />
          <p className={location.pathname === REPORT_PATH ? 'is-active' : ''}>리포트</p>
        </button>

        <button
          type="button"
          className={menuOpen ? 'bottom_nav_plus is-x' : 'bottom_nav_plus'}
          aria-label={menuOpen ? '닫기' : '회복 체크'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <HomeXIcon className="bottom_nav_x_icon" />
          ) : (
            <div className="bottom_nav_plus_icon"></div>
          )}
        </button>

        <button type="button" className="bottom_nav_item" onClick={() => navigate(SKIN_PATH)} >
          <img src={location.pathname === SKIN_PATH ? Skin_active_icon : Skin_icon} alt="" className="bottom_nav_icon" />
          <p className={location.pathname === SKIN_PATH ? 'is-active' : ''}>피부</p>
        </button>

        <button type="button" className="bottom_nav_item" onClick={() => navigate(MY_PATH)}>
          <img src={location.pathname === MY_PATH ? Mypage_active_icon : Mypage_icon} alt="" className="bottom_nav_icon" />
          <p className={location.pathname === MY_PATH ? 'is-active' : ''}>마이</p>
        </button>


      </div>
    </div>
  )
}

export default BottomNav
