import axios from '../../../config/axios';
import * as paymentBlockTypes from '../../constants/invoice/paymentBlockTypes';

export const fetchPaymentBlock = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('payment_block', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: paymentBlockTypes.SUCCESS_FETCH_PAYMENT_BLOCK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: paymentBlockTypes.FAIL_FETCH_PAYMENT_BLOCK, response: error.response })
                });
        })
    }
}

export const showPaymentBlock = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('payment_block/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: paymentBlockTypes.SUCCESS_SHOW_PAYMENT_BLOCK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: paymentBlockTypes.FAIL_SHOW_PAYMENT_BLOCK, response: error.response })
                });
        })
    }
}

export const deletePaymentBlock = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('payment_block/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: paymentBlockTypes.SUCCESS_DELETE_PAYMENT_BLOCK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: paymentBlockTypes.FAIL_DELETE_PAYMENT_BLOCK, response: error.response })
                });
        })
    }
}

export const savePaymentBlock = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('payment_block', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: paymentBlockTypes.SUCCESS_SAVE_PAYMENT_BLOCK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: paymentBlockTypes.FAIL_SAVE_PAYMENT_BLOCK, response: error.response })
                });
        })
    }
}
export const updatePaymentBlock = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('payment_block/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: paymentBlockTypes.SUCCESS_UPDATE_PAYMENT_BLOCK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: paymentBlockTypes.SUCCESS_UPDATE_PAYMENT_BLOCK, response: error.response })
                });
        })
    }
}
export const syncPaymentBlock = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_payment_block', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: paymentBlockTypes.SUCCESS_SYNC_PAYMENT_BLOCK,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: paymentBlockTypes.FAIL_SYNC_PAYMENT_BLOCK, response: error.response })
						});
        })
    }
}
