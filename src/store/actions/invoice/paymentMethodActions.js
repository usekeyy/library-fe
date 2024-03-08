import axios from '../../../config/axios';
import * as PaymentMethodTypes from '../../constants/invoice/paymentMethodTypes';

export const fetchPaymentMethod = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('payment_method', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: PaymentMethodTypes.SUCCESS_FETCH_PAYMENT_METHOD,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: PaymentMethodTypes.FAIL_FETCH_PAYMENT_METHOD, response: error.response })
                });
        })
    }
}

export const showPaymentMethod = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('payment_method/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: PaymentMethodTypes.SUCCESS_SHOW_PAYMENT_METHOD,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: PaymentMethodTypes.FAIL_SHOW_PAYMENT_METHOD, response: error.response })
                });
        })
    }
}

export const deletePaymentMethod = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('payment_method/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: PaymentMethodTypes.SUCCESS_DELETE_PAYMENT_METHOD,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: PaymentMethodTypes.FAIL_DELETE_PAYMENT_METHOD, response: error.response })
                });
        })
    }
}

export const savePaymentMethod = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('payment_method', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: PaymentMethodTypes.SUCCESS_SAVE_PAYMENT_METHOD,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: PaymentMethodTypes.FAIL_SAVE_PAYMENT_METHOD, response: error.response })
                });
        })
    }
}
export const updatePaymentMethod = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('payment_method/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: PaymentMethodTypes.SUCCESS_UPDATE_PAYMENT_METHOD,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: PaymentMethodTypes.SUCCESS_UPDATE_PAYMENT_METHOD, response: error.response })
                });
        })
    }
}
export const syncPaymentMethod = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_payment_method', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: PaymentMethodTypes.SUCCESS_SYNC_PAYMENT_METHOD,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: PaymentMethodTypes.FAIL_SYNC_PAYMENT_METHOD, response: error.response })
						});
        })
    }
}
