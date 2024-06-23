import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import React, { useEffect, useState, useMemo } from 'react'
import { Checkbox, InputNumber, Form } from 'antd'
import { useContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { updateCard } from "../../../services/CardService";
import { AuthContext } from "../../../contexts/AuthContext";
import { removeOrderProduct, removeAllOrderProduct, increaseAmount, decreaseAmount, selectedOrder } from "../../../redux/slides/cartSlice";
import { convertPrice } from "../../../utils/utils";
import { toast } from 'react-toastify';
import ModalOrder from "./ModalOrder"
import { DeleteFilled, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { getCart } from "../../../services/CartService";

const cx = classNames.bind(styles);
const Cart = () => {
    const { token, user } = useContext(AuthContext)
    const cart = useSelector((state) => state.cart)
    const [listChecked, setListChecked] = useState([])
    const [showModal, setShowModal] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }))
    }, [listChecked])

    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }
    };

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            cart?.products.forEach((item) => {
                newListChecked.push(item?.productId._id)
            })
            setListChecked(newListChecked)
        } else {
            setListChecked([])
        }
    }
    const handleRemoveAllOrder = () => {
        console.log("list check", listChecked)
        if (listChecked?.length > 1) {
            dispatch(removeAllOrderProduct({ listChecked }))
        }
    }

    const handleChangeCount = (type, idProduct, limited) => {
        console.log("tang, giam")
        if (type === 'increase') {
            if (!limited) {
                dispatch(increaseAmount({ idProduct }))
            }
        } else {
            if (!limited) {
                dispatch(decreaseAmount({ idProduct }))
            }
        }
        console.log("check lại", cart)
    }

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }))
    }

    const handleShowModal = () => {
        if (listChecked.length > 0) {
            console.log('Total Price:', totalPriceMemo);
            setShowModal(true);
        } else {
            toast.error("Vui lòng chọn sản phẩm muốn mua");
        }
    };

    const handleOnclickEmpty = () => {
        navigate("/handmadeItems");
    };

    const totalPriceMemo = useMemo(() => {
        const result = cart?.productsSelected?.reduce((total, cur) => {
            return total + ((cur.productId.price * cur.quantity))
        }, 0)
        return result
    }, [cart])

    return (
        <div className={cx("wrapper")}>
            <div className={cx("cart-container")}>
                <h5 style={{ fontWeight: 'bold' }}>Giỏ hàng</h5>
                {cart.products.length > 0 ? (
                    <div className={cx('cart-product')}>
                        <div className={cx("left")}>
                            <div className={cx("header")}>
                                <span style={{ display: 'inline-block', width: '380px' }}>
                                    <Checkbox
                                        className={cx('checkbox')}
                                        onChange={handleOnchangeCheckAll}
                                        checked={listChecked?.length === cart?.products?.length}
                                    ></Checkbox>
                                    <span style={{ fontSize: '16px' }}> Tất cả ({cart?.products.length}) sản phẩm</span>
                                </span>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '16px' }} >Đơn giá</span>
                                    <span style={{ fontSize: '16px' }}>Số lượng</span>
                                    <span style={{ fontSize: '16px' }}>Thành tiền</span>
                                    <DeleteFilled style={{ cursor: 'pointer', color: 'red' }} onClick={handleRemoveAllOrder} />
                                </div>
                            </div>
                            <div className={cx('list-product')}>
                                {cart?.products.map((product) => {
                                    return (
                                        <div className={cx('wrapper-items')} key={product.productId._id}>
                                            <div style={{ width: '380px', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Checkbox onChange={onChange} value={product.productId._id} checked={listChecked.includes(product.productId._id)}></Checkbox>
                                                <img src={product?.productId.image} style={{ width: '88px', height: '90px', objectFit: 'cover' }} />
                                                <div style={{
                                                    marginLeft: '10px',
                                                    width: 260,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>{product?.productId.name}</div>
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span>
                                                    <span style={{ fontSize: '16px', color: '#242424' }}>{convertPrice(product?.productId.price)}</span>
                                                </span>
                                                <div className={cx('count-item')}>
                                                    <div style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease', product?.productId._id, product?.quantity === 1)}>
                                                        <MinusOutlined style={{ color: '#000', fontSize: '13px' }} />
                                                    </div>
                                                    <InputNumber style={{ width: '40px', borderTop: 'none', borderBottom: 'none', borderRadius: '0px' }} defaultValue={product?.quantity} value={product?.quantity} size="small" min={1} max={product?.productId.quantity} />
                                                    <div style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', product?.productId._id, product?.quantity === product?.productId.quantity, product?.quantity === 1)}>
                                                        <PlusOutlined style={{ color: '#000', fontSize: '13px' }} />
                                                    </div>
                                                </div>
                                                <span style={{ color: 'rgb(255, 66, 78)', fontSize: '16px', fontWeight: 500 }}>{convertPrice(product?.productId.price * product?.quantity)}</span>
                                                <DeleteFilled style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDeleteOrder(product?.productId._id)} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className={cx('right')}>
                            <div className={cx('price-total')}>
                                <span> <p style={{ fontSize: '20px', fontWeight: '400' }}>Tổng tiền: </p></span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '20px', fontWeight: '550' }}>{convertPrice(totalPriceMemo)}</span>
                                </span>
                            </div>
                            <button onClick={handleShowModal}>
                                Mua hàng
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={cx("empty")}>
                        <div>
                            <img src="https://theme.hstatic.net/1000277297/1001091004/14/cart_empty_background.png?v=244" alt="empty cart" />
                        </div>
                        <h3>Bạn chưa thêm sản phẩm nào vào giỏ hết</h3>
                        <p>Về trang "Tiệm hand" để lựa sản phẩm nhé!!</p>
                        <button onClick={handleOnclickEmpty}>Tới tiệm hand</button>
                    </div>
                )}
                <ModalOrder show={showModal} handleClose={() => setShowModal(false)} listProduct={cart?.productsSelected} itemsPrice={totalPriceMemo} />
            </div>
        </div>
    )
}

export default Cart;