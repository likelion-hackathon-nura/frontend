import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './CosmeticManagement.css'

import PrevBtn from '../../../assets/images/prev_btn.svg'
import Product01 from '../../../assets/images/recovery_product_1.svg'
import Product02 from '../../../assets/images/recovery_product_2.svg'
import Product03 from '../../../assets/images/recovery_product_3.svg'
import Product04 from '../../../assets/images/recovery_product_4.svg'
import ProductSearchIcon from '../../../assets/images/cosmetic_search_icon.svg'
import CosmeticCheckIcon from '../../../assets/images/recovery_check_icon.svg'
import CosmeticPlusIcon from '../../../assets/images/cosmetic_plus_icon.svg'

const initialProducts = [
    {
        id: 1,
        name: '마일드 시카 세럼',
        date: '2026.06.12',
        image: Product01,
        descriptions: [
            '민감성 피부에 적합한 저자극 진정 세럼',
            '병풀추출물, 판테놀 함유',
        ],
    },
    {
        id: 2,
        name: '세라마이드 수분 크림',
        date: '2026.06.12',
        image: Product02,
        descriptions: [
            '피부에 수분 보호막을 형성하는 보습 크림',
            '히알루론산, 세라마이드 함유',
        ],
    },
    {
        id: 3,
        name: '비타 브라이트 앰플',
        date: '2026.06.12',
        image: Product03,
        descriptions: [
            '칙칙한 피부를 환하게 가꾸는 비타민 앰플',
            '비타민C, 알부틴 함유',
        ],
    },
    {
        id: 4,
        name: '그린티 밸런싱 토너',
        date: '2026.06.12',
        image: Product04,
        descriptions: [
            '피부 유·수분 밸런스를 맞춰주는 진정 토너',
            '녹차추출물 함유',
        ],
    },
]

const CosmeticManagement = () => {

    const navigate = useNavigate()
    const pointerStartX = useRef(0)

    const [products, setProducts] = useState(initialProducts)
    const [searchValue, setSearchValue] = useState('')
    const [openedProductId, setOpenedProductId] = useState(null)

    const filteredProducts = products.filter((product) =>
        product.name.includes(searchValue.trim())
    )

    const handlePointerDown = (e) => {
        pointerStartX.current = e.clientX
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const handlePointerUp = (e, productId) => {
        const moveDistance = e.clientX - pointerStartX.current

        if (moveDistance < -45) {
            setOpenedProductId(productId)
        }

        if (moveDistance > 45) {
            setOpenedProductId(null)
        }
    }

    const handleDelete = (productId) => {
        setProducts((prev) =>
            prev.filter((product) => product.id !== productId)
        )
        setOpenedProductId(null)
    }

    return (
        <div className="cosmeticmanage_wrap">
            <div className="cosmeticmanage_top">
                <button
                    type="button"
                    className="cosmeticmanage_prev_btn"
                    onClick={() => navigate(-1)}
                >
                    <img src={PrevBtn} alt="뒤로가기" />
                </button>

                <p>화장품 등록 및 관리</p>
            </div>

            <div className="cosmeticmanage_main">
                <div className="cosmeticmanage_search">
                    <img src={ProductSearchIcon} alt="" />
                    <input
                        type="text"
                        value={searchValue}
                        placeholder="화장품 이름으로 검색"
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                <div className="cosmeticmanage_list_top">
                    <p>등록된 화장품</p>
                    <span>총 {filteredProducts.length}개</span>
                </div>

                <div className="cosmeticmanage_list">
                    {filteredProducts.map((product) => (
                        <div
                            className="cosmeticmanage_swipe"
                            key={product.id}
                        >
                            <button
                                type="button"
                                className="cosmeticmanage_delete"
                                onClick={() => handleDelete(product.id)}
                            >
                                삭제
                            </button>

                            <div
                                className={
                                    openedProductId === product.id
                                        ? 'cosmeticmanage_card open'
                                        : 'cosmeticmanage_card'
                                }
                                onPointerDown={handlePointerDown}
                                onPointerUp={(e) =>
                                    handlePointerUp(e, product.id)
                                }
                            >
                                <div
                                    className="cosmeticmanage_image"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />
                                </div>

                                <div className="cosmeticmanage_info">
                                    <div className="cosmeticmanage_info_top">
                                        <p>{product.name}</p>
                                        <span>
                                            등록일 {product.date}
                                        </span>
                                    </div>

                                    {product.descriptions.map(
                                        (description) => (
                                            <div
                                                className="cosmeticmanage_description"
                                                key={description}
                                            >
                                                <img src={CosmeticCheckIcon} alt="" />
                                                <p>{description}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <p className="cosmeticmanage_empty">
                        검색 결과가 없습니다.
                    </p>
                )}
            </div>

            <button type="button" className="cosmeticmanage_add" onClick={() => navigate('/mypage/cosmetic-management/add')}><img src={CosmeticPlusIcon} alt="" />화장품 추가하기</button>
        </div>
    )
}

export default CosmeticManagement
