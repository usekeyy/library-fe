import axios from '../../../config/axios';
import * as houseBankTypes from '../../constants/invoice/houseBankTypes';

export const fetchHouseBank = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('house_bank', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: houseBankTypes.SUCCESS_FETCH_HOUSE_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: houseBankTypes.FAIL_FETCH_HOUSE_BANK, response: error.response })
                });
        })
    }
}

export const showHouseBank = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('house_bank/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: houseBankTypes.SUCCESS_SHOW_HOUSE_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: houseBankTypes.FAIL_SHOW_HOUSE_BANK, response: error.response })
                });
        })
    }
}

export const deleteHouseBank = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('house_bank/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: houseBankTypes.SUCCESS_DELETE_HOUSE_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: houseBankTypes.FAIL_DELETE_HOUSE_BANK, response: error.response })
                });
        })
    }
}

export const saveHouseBank = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('house_bank', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: houseBankTypes.SUCCESS_SAVE_HOUSE_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: houseBankTypes.FAIL_SAVE_HOUSE_BANK, response: error.response })
                });
        })
    }
}
export const updateHouseBank = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('house_bank/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: houseBankTypes.SUCCESS_UPDATE_HOUSE_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: houseBankTypes.SUCCESS_UPDATE_HOUSE_BANK, response: error.response })
                });
        })
    }
}
export const syncHouseBank = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_house_bank', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: houseBankTypes.SUCCESS_SYNC_HOUSE_BANK,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: houseBankTypes.FAIL_SYNC_HOUSE_BANK, response: error.response })
						});
        })
    }
}

export const fetchSelectHouseBank = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('select_house_bank', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: houseBankTypes.SUCCESS_FETCH_HOUSE_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: houseBankTypes.FAIL_FETCH_HOUSE_BANK, response: error.response })
                });
        })
    }
}

export const fetchSelectAccountId = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('select_account_id', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: houseBankTypes.SUCCESS_FETCH_HOUSE_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: houseBankTypes.FAIL_FETCH_HOUSE_BANK, response: error.response })
                });
        })
    }
}

