import axios from '../../../config/axios';
import * as actionTypes from '../../constants/bankTypes';

export const fetchBank = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('bank', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_BANK, response: error.response })
                });
        })
    }
}

export const showBank = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('bank/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SHOW_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SHOW_BANK, response: error.response })
                });
        })
    }
}

export const deleteBank = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('bank/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_BANK, response: error.response })
                });
        })
    }
}

export const saveBank = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('bank', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_SAVE_BANK, response: error.response })
                });
        })
    }
}
export const updateBank = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('bank/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_UPDATE_BANK, response: error.response })
                });
        })
    }
}