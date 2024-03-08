import axios from '../../../config/axios';
import * as taxType from '../../constants/taxTypes';

export const fetchTax = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tax', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: taxType.SUCCESS_FETCH_TAX,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: taxType.FAIL_FETCH_TAX, response: error.response })
                });
        })
    }
}

export const showTax = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tax/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: taxType.SUCCESS_SHOW_TAX,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: taxType.FAIL_SHOW_TAX, response: error.response })
                });
        })
    }
}

export const deleteTax = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tax/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: taxType.SUCCESS_DELETE_TAX,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: taxType.FAIL_DELETE_TAX, response: error.response })
                });
        })
    }
}

export const saveTax = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tax', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: taxType.SUCCESS_SAVE_TAX,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: taxType.FAIL_SAVE_TAX, response: error.response })
                });
        })
    }
}
export const updateTax = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tax/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: taxType.SUCCESS_UPDATE_TAX,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: taxType.FAIL_UPDATE_TAX, response: error.response })
                });
        })
    }
}
export const syncTax = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tax', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: taxType.SUCCESS_SYNC_TAX,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: taxType.FAIL_SYNC_TAX, response: error.response })
						});
        })
    }
}
