import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './EditProfile.css'
import {
    getMyInfo,
    updateMyInfo,
} from '../../../api/mypage'

import PrevBtn from '../../../assets/images/prev_btn.svg'
import ProfileIcon from '../../../assets/images/mypage_profile_icon.svg'

const EditProfile = () => {
    const navigate = useNavigate()

    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const loadMyInfo = async () => {
            try {
                const data = await getMyInfo()

                setNickname(data.nickname || '')
                setEmail(data.email || '')
            } catch (error) {
                alert(
                    error.message ||
                    '내 정보를 불러오지 못했습니다.'
                )
            }
        }

        loadMyInfo()
    }, [])

    const [emailId = '', emailDomain = ''] = email.split('@')

    const handleSubmit = async () => {
        if (isSubmitting) {
            return
        }

        const trimmedNickname = nickname.trim()

        if (trimmedNickname.length < 4 || trimmedNickname.length > 12) {
            alert('닉네임은 4~12자로 입력해주세요.')
            return
        }

        if (newPassword !== newPasswordConfirm) {
            alert('새 비밀번호가 일치하지 않습니다.')
            return
        }

        const requestData = {
            nickname: trimmedNickname,
        }

        if (newPassword) {
            requestData.newPassword = newPassword
            requestData.newPasswordConfirm = newPasswordConfirm
        }

        setIsSubmitting(true)

        try {
            await updateMyInfo(requestData)
            alert('내 정보가 수정되었습니다.')
            navigate('/mypage')
        } catch (error) {
            alert(
                error.message ||
                '내 정보 수정에 실패했습니다.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

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
                        value={nickname}
                        onChange={(event) => setNickname(event.target.value)}
                        maxLength={12}
                    />
                    <p>4~12자(한글, 영문 소문자, 숫자 조합 가능)</p>
                </div>

                <div className="editprofile_field">
                    <label htmlFor="new-password">비밀번호 변경</label>
                    <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="새 비밀번호를 입력해주세요."
                        autoComplete="new-password"
                    />
                    <input
                        type="password"
                        value={newPasswordConfirm}
                        onChange={(event) => setNewPasswordConfirm(event.target.value)}
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
                            value={emailId}
                            readOnly
                        />
                        <span>@</span>
                        <input
                            type="text"
                            value={emailDomain}
                            readOnly
                        />
                    </div>


                </div>

                <button
                    type="button"
                    className="editprofile_submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '수정 중...' : '완료'}
                </button>
            </div>
        </div>
    )
}

export default EditProfile
