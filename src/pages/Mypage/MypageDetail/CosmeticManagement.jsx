import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import './CosmeticManagement.css'
import {
    deleteRegisteredCosmetic,
    getRegisteredCosmetics,
} from '../../../api/skin'

import PrevBtn from '../../../assets/images/prev_btn.svg'
import Product01 from '../../../assets/images/recovery_product_1.svg'
import Product02 from '../../../assets/images/recovery_product_2.svg'
import Product03 from '../../../assets/images/recovery_product_3.svg'
import Product04 from '../../../assets/images/recovery_product_4.svg'
import ProductSearchIcon from '../../../assets/images/cosmetic_search_icon.svg'
import CosmeticCheckIcon from '../../../assets/images/recovery_check_icon.svg'
import CosmeticPlusIcon from '../../../assets/images/cosmetic_plus_icon.svg'

const FALLBACK_IMAGES = [
    Product01,
    Product02,
    Product03,
    Product04,
]

const PRODUCT_TYPE_LABELS = {
    CLEANSER: '클렌저',
    TONER: '토너',
    SERUM: '세럼',
    LOTION: '로션',
    CREAM: '크림',
    MASK: '마스크팩',
    OTHER: '기타',
}

const formatDate = date => {
    if (!date) return ''

    return date.slice(0, 10).replaceAll('-', '.')
}

const formatIngredients = ingredients => {
    if (!ingredients) return ''

    try {
        const parsedIngredients = JSON.parse(ingredients)

        return Array.isArray(parsedIngredients)
            ? parsedIngredients.join(', ')
            : ingredients
    } catch {
        return ingredients
    }
}

const getCosmeticList = data => {
    if (Array.isArray(data)) return data

    return (
        data?.registeredCosmetics ||
        data?.cosmetics ||
        data?.items ||
        data?.content ||
        []
    )
}

const normalizeProduct = (product, index) => {
    const cosmeticType =
        product.cosmeticType || product.cosmetic_type

    const ingredients = formatIngredients(
        product.coreIngredients ||
        product.core_ingredients ||
        product.cosmeticIngredients ||
        product.cosmetic_ingredients
    )

    return {
        id:
            product.cosmeticId ||
            product.registeredCosmeticId ||
            product.registered_cosmetic_id ||
            product.id,
        name:
            product.cosmeticName ||
            product.cosmetic_name ||
            '이름 없는 제품',
        date: formatDate(
            product.registeredDate ||
            product.registeredAt ||
            product.registered_at
        ),
        image:
            product.cosmeticUrl ||
            product.cosmetic_url ||
            FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
        descriptions: [
            product.cosmeticBrand ||
            product.cosmetic_brand,
            ingredients ||
            PRODUCT_TYPE_LABELS[cosmeticType] ||
            cosmeticType,
        ].filter(Boolean),
    }
}

const CosmeticManagement = () => {

    const navigate = useNavigate()
    const pointerStartX = useRef(0)

    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchValue, setSearchValue] = useState('')
    const [openedProductId, setOpenedProductId] = useState(null)

    useEffect(() => {
        const loadCosmetics = async () => {
            try {
                const data = await getRegisteredCosmetics()
                const cosmeticList = getCosmeticList(data)

                setProducts(
                    cosmeticList.map((product, index) =>
                        normalizeProduct(product, index)
                    )
                )
            } catch (error) {
                console.error('등록 화장품 목록 조회 실패:', error)
                alert(error.message || '등록 화장품을 불러오지 못했습니다.')
            } finally {
                setIsLoading(false)
            }
        }

        loadCosmetics()
    }, [])

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

    const handleDelete = async productId => {
        if (!window.confirm('등록한 화장품을 삭제할까요?')) return

        try {
            await deleteRegisteredCosmetic(productId)

            setProducts(prev =>
                prev.filter(product => product.id !== productId)
            )

            setOpenedProductId(null)
        } catch (error) {
            console.error('등록 화장품 삭제 실패:', error)
            alert(error.message || '화장품 삭제에 실패했습니다.')
        }
    }

    return (
        <div className="cosmeticmanage_wrap">
            <div className="cosmeticmanage_top">
                <button
                    type="button"
                    className="cosmeticmanage_prev_btn"
                    onClick={() => navigate('/mypage')}
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

                {!isLoading && filteredProducts.length === 0 && (
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
