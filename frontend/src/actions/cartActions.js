import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id, history) => (dispatch, getState) => {
    // console.log(history, id, 'history');
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: { product: id }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    history.push('/cart');
}
 
export const saveShippingAddress = (data) => (dispatch) => {
    // console.log(history, id, 'history');
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    })
    localStorage.setItem('shippingAddress', JSON.stringify(data));
}

export const savePaymentMethod = (paymentMethod) => (dispatch) => {
    // console.log(history, id, 'history');
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: paymentMethod
    })
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
}