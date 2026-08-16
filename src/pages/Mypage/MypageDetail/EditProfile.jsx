import React from 'react'
import { useNavigate } from 'react-router-dom'

import './EditProfile.css'

import PrevBtn from '../../../assets/images/prev_btn.svg'
import ProfileIcon from '../../../assets/images/mypage_profile_icon.svg'

const EditProfile = () => {
    const navigate = useNavigate()

    return (
        <div className="editprofile_wrap">
            <div className="editprofile_top">
                <button
                    type="button"
                    className="editprofile_prev_btn"
                    onClick={() => navigate(-1)}
                >
                    <img src={PrevBtn} alt="뒤로가기" />
                </button>
                <p>내 정보 수정</p>
            </div>

            <div className="editprofile_main">
                <img src={ProfileIcon} alt="프로필" className="editprofile_icon" />

                <div className="editprofile_field">
                    <label htmlFor="nickname">닉네임</label>
                    <input
                        id="nickname"
                        type="text"
                        defaultValue="수정"
                    />
                    <p>4~12자(한글, 영문 소문자, 숫자 조합 가능)</p>
                </div>

                <div className="editprofile_field">
                    <label htmlFor="new-password">비밀번호 변경</label>
                    <input
                        id="new-password"
                        type="password"
                        placeholder="새 비밀번호를 입력해주세요."
                        autoComplete="new-password"
                    />
                    <input
                        type="password"
                        placeholder="새 비밀번호를 다시 한번 입력해주세요."
                        autoComplete="new-password"
                    />
                    <p>
                        8~20자(영문 대문자, 소문자, 숫자, 특수문자 중
                        2가지 이상 포함)
                    </p>
                </div>

                <div className="editprofile_field">
                    <label>이메일</label>

                    <div className="editprofile_email">
                        <input
                            type="text"
                            defaultValue="sujeong123"
                            readOnly
                        />
                        <span>@</span>
                        <input
                            type="text"
                            defaultValue="naver.com"
                            readOnly
                        />
                    </div>

                    
                </div>

                <button type="button" className="editprofile_submit" onClick={() => navigate('/mypage')}>
                    완료
                </button>
            </div>
        </div>
    )
}

export default EditProfile
