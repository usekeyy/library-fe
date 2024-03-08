import axios from '../../../config/axios';
import * as termsOfPaymentType from '../../constants/termsOfPayment';

export const fetchTermsOfPayment = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('terms_of_payment', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: termsOfPaymentType.SUCCESS_FETCH_TERMS_OF_PAYMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: termsOfPaymentType.FAIL_FETCH_TERMS_OF_PAYMENT, response: error.response })
                });
        })
    }
}

export const showTermsOfPayment = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('terms_of_payment/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: termsOfPaymentType.SUCCESS_SHOW_TERMS_OF_PAYMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: termsOfPaymentType.FAIL_SHOW_TERMS_OF_PAYMENT, response: error.response })
                });
        })
    }
}

export const deleteTermsOfPayment = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('terms_of_payment/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: termsOfPaymentType.SUCCESS_DELETE_TERMS_OF_PAYMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: termsOfPaymentType.FAIL_DELETE_TERMS_OF_PAYMENT, response: error.response })
                });
        })
    }
}

export const saveTermsOfPayment = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('terms_of_payment', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: termsOfPaymentType.SUCCESS_SAVE_TERMS_OF_PAYMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: termsOfPaymentType.FAIL_SAVE_TERMS_OF_PAYMENT, response: error.response })
                });
        })
    }
}
export const updateTermsOfPayment = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('terms_of_payment/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: termsOfPaymentType.SUCCESS_UPDATE_TERMS_OF_PAYMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: termsOfPaymentType.FAIL_UPDATE_TERMS_OF_PAYMENT, response: error.response })
                });
        })
    }
}
export const syncTermsOfPayment = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_terms_of_payment', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: termsOfPaymentType.SUCCESS_SYNC_TERMS_OF_PAYMENT,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: termsOfPaymentType.FAIL_SYNC_TERMS_OF_PAYMENT, response: error.response })
						});
        })
    }
}
