import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './AddCosmetic.css'
import {
    analyzeCosmeticOcr,
    registerCosmetic,
} from '../../../api/skin'

import PrevBtn from '../../../assets/images/prev_btn.svg'
import CameraIcon from '../../../assets/images/add_camera_icon.svg'
import NextArrow from '../../../assets/images/next_arrow.svg'


const productTypes = [
    '세럼',
    '크림',
    '토너',
    '로션',
    '클렌저',
    '선크림',
    '오일',
    '기타',
]

const PRODUCT_TYPE_MAP = {
    세럼: 'SERUM',
    크림: 'CREAM',
    토너: 'TONER',
    로션: 'LOTION',
    클렌저: 'CLEANSER',
    선크림: 'OTHER',
    오일: 'OTHER',
    기타: 'OTHER',
}

const AddCosmetic = () => {
    const navigate = useNavigate()

    const [selectedType, setSelectedType] = useState('')
    const [photoPreview, setPhotoPreview] = useState('')
    const [brandName, setBrandName] = useState('')
    const [productName, setProductName] = useState('')
    const [photo, setPhoto] = useState(null)
    const [cosmeticIngredients, setCosmeticIngredients] = useState('')
    const [coreIngredients, setCoreIngredients] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0]

        if (!file) return

        setPhoto(file)

        const reader = new FileReader()

        reader.onload = () => {
            setPhotoPreview(reader.result)
        }

        reader.readAsDataURL(file)

        try {
            setIsAnalyzing(true)

            const response = await analyzeCosmeticOcr(file)
            const ocrData = response?.data ?? response

            setCosmeticIngredients(ocrData.cosmeticIngredients || '')
            setCoreIngredients(ocrData.coreIngredients || '')

            alert('화장품 성분 분석이 완료되었습니다.')
        } catch (error) {
            console.error('화장품 OCR 분석 실패:', error)
            alert(error.message || '화장품 성분 분석에 실패했습니다.')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!brandName.trim() || !productName.trim() || !selectedType) {
            alert('브랜드명, 제품 종류, 제품명을 모두 입력해주세요.')
            return
        }

        if (!photo) {
            alert('화장품 뒷면 사진을 업로드해주세요.')
            return
        }

        if (isAnalyzing) {
            alert('성분 분석이 끝날 때까지 잠시 기다려주세요.')
            return
        }

        try {
            setIsSubmitting(true)

            await registerCosmetic({
                cosmeticBrand: brandName.trim(),
                cosmeticName: productName.trim(),
                cosmeticType: PRODUCT_TYPE_MAP[selectedType],
                cosmeticIngredients,
                coreIngredients,
                cosmeticUrl: '',
            })

            alert('화장품이 등록되었습니다.')
            navigate('/mypage/cosmetic-management')
        } catch (error) {
            console.error('화장품 등록 실패:', error)
            alert(error.message || '화장품 등록에 실패했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="addcosmetic_wrap">
            <div className="addcosmetic_top">
                <button type="button" className="addcosmetic_prev_btn" onClick={() => navigate(-1)}>
                    <img src={PrevBtn} alt="뒤로가기" />
                </button>
                <p>화장품 추가하기</p>
            </div>

            <form className="addcosmetic_form" onSubmit={handleSubmit}>
                <div className="addcosmetic_field">
                    <label htmlFor="brand-name">브랜드명</label>
                    <input
                        id="brand-name"
                        type="text"
                        placeholder="브랜드명을 입력해주세요."
                        value={brandName}
                        onChange={e => setBrandName(e.target.value)}
                    />
                </div>

                <div className="addcosmetic_field">
                    <label>제품 종류</label>

                    <div className="addcosmetic_type_list">
                        {productTypes.map((type) => (
                            <button
                                type="button"
                                key={type}
                                className={
                                    selectedType === type
                                        ? 'addcosmetic_type active'
                                        : 'addcosmetic_type'
                                }
                                onClick={() => setSelectedType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="addcosmetic_field">
                    <label htmlFor="product-name">제품명</label>

                    <input
                        id="product-name"
                        type="text"
                        placeholder="제품명을 입력해주세요."
                        value={productName}
                        onChange={e => setProductName(e.target.value)}
                    />
                </div>

                <div className="addcosmetic_field">
                    <label htmlFor="product-photo">제품 사진</label>

                    <p className="addcosmetic_photo_guide">
                        성분 정보가 잘 보이도록 화장품 뒷면을
                        촬영해주세요.
                    </p>

                    <label
                        htmlFor="product-photo"
                        className="addcosmetic_upload"
                    >
                        {photoPreview ? (
                            <img
                                src={photoPreview}
                                alt="화장품 미리보기"
                                className="addcosmetic_preview"
                            />
                        ) : (
                            <>
                                <img src={CameraIcon} alt="" className="addcosmetic_camera" />

                                <p>
                                    화장품 뒷면 사진을 업로드 해주세요.
                                </p>

                                <span className="addcosmetic_upload_btn">
                                    사진 업로드하기<img src={NextArrow} alt="" />
                                </span>
                            </>
                        )}
                    </label>

                    <input
                        id="product-photo"
                        className="addcosmetic_file_input"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />
                </div>

                <button
                    type="submit"
                    className="addcosmetic_submit"
                    disabled={isAnalyzing || isSubmitting}
                >
                    {isAnalyzing
                        ? '성분 분석 중...'
                        : isSubmitting
                            ? '등록 중...'
                            : '완료'}
                </button>
            </form>
        </div>
    )
}

export default AddCosmetic
