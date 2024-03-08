import axios from '../../../config/axios';
import * as konfirmasiTypes from '../../constants/expediting/konfirmasiTypes';

export const fetchKonfirmasi = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/confirmation_forum', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: konfirmasiTypes.SUCCESS_FETCH_KONFIRMASI,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: konfirmasiTypes.FAIL_FETCH_KONFIRMASI, response: error.response })
                });
        })
    }
}

export const showKonfirmasi = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/confirmation_forum/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: konfirmasiTypes.SUCCESS_SHOW_KONFIRMASI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: konfirmasiTypes.FAIL_SHOW_KONFIRMASI, response: error.response })
                });
        })
    }
}

export const deleteKonfirmasi = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('invoice/confirmation_forum/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: konfirmasiTypes.SUCCESS_DELETE_KONFIRMASI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: konfirmasiTypes.FAIL_DELETE_KONFIRMASI, response: error.response })
                });
        })
    }
}

export const saveKonfirmasi = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/confirmation_forum', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: konfirmasiTypes.SUCCESS_SAVE_KONFIRMASI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: konfirmasiTypes.FAIL_SAVE_KONFIRMASI, response: error.response })
                });
        })
    }
}
export const updateKonfirmasi = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/confirmation_forum/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: konfirmasiTypes.SUCCESS_UPDATE_KONFIRMASI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: konfirmasiTypes.SUCCESS_UPDATE_KONFIRMASI, response: error.response })
                });
        })
    }
}
