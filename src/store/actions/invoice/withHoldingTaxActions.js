import axios from '../../../config/axios';
import * as withHoldingTaxTypes from '../../constants/invoice/withHoldingTaxTypes';

export const fetchWithHoldingTax = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('w_holding_tax', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: withHoldingTaxTypes.SUCCESS_FETCH_WITH_HOLDING_TAX,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: withHoldingTaxTypes.FAIL_FETCH_WITH_HOLDING_TAX, response: error.response })
                });
        })
    }
}

export const showWithHoldingTax = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('w_holding_tax/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: withHoldingTaxTypes.SUCCESS_SHOW_WITH_HOLDING_TAX,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: withHoldingTaxTypes.FAIL_SHOW_WITH_HOLDING_TAX, response: error.response })
                });
        })
    }
}

export const deleteWithHoldingTax = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('w_holding_tax/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: withHoldingTaxTypes.SUCCESS_DELETE_WITH_HOLDING_TAX,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: withHoldingTaxTypes.FAIL_DELETE_WITH_HOLDING_TAX, response: error.response })
                });
        })
    }
}

export const saveWithHoldingTax = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('w_holding_tax', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: withHoldingTaxTypes.SUCCESS_SAVE_WITH_HOLDING_TAX,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: withHoldingTaxTypes.FAIL_SAVE_WITH_HOLDING_TAX, response: error.response })
                });
        })
    }
}
export const updateWithHoldingTax = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('w_holding_tax/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: withHoldingTaxTypes.SUCCESS_UPDATE_WITH_HOLDING_TAX,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: withHoldingTaxTypes.SUCCESS_UPDATE_WITH_HOLDING_TAX, response: error.response })
                });
        })
    }
}
export const syncWithHoldingTax = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_w_holding_tax', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: withHoldingTaxTypes.SUCCESS_SYNC_WITH_HOLDING_TAX,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: withHoldingTaxTypes.FAIL_SYNC_WITH_HOLDING_TAX, response: error.response })
						});
        })
    }
}
