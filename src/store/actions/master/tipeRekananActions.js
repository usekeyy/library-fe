import axios from '../../../config/axios';
import * as tipeRekananTypes from '../../constants/tipeRekananTypes';

export const fetchTipeRekanan = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor_tipe_rekanan', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: tipeRekananTypes.SUCCESS_FETCH_TIPE_REKANAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: tipeRekananTypes.FAIL_FETCH_TIPE_REKANAN, response: error.response })
                });
        })
    }
}

export const showTipeRekanan = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor_tipe_rekanan/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: tipeRekananTypes.SUCCESS_SHOW_TIPE_REKANAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: tipeRekananTypes.FAIL_SHOW_TIPE_REKANAN, response: error.response })
                });
        })
    }
}

export const deleteTipeRekanan = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor_tipe_rekanan/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: tipeRekananTypes.SUCCESS_DELETE_TIPE_REKANAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: tipeRekananTypes.FAIL_DELETE_TIPE_REKANAN, response: error.response })
                });
        })
    }
}

export const saveTipeRekanan = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor_tipe_rekanan', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: tipeRekananTypes.SUCCESS_SAVE_TIPE_REKANAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: tipeRekananTypes.FAIL_SAVE_TIPE_REKANAN, response: error.response })
                });
        })
    }
}
export const updateTipeRekanan = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor_tipe_rekanan/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: tipeRekananTypes.SUCCESS_UPDATE_TIPE_REKANAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: tipeRekananTypes.SUCCESS_UPDATE_TIPE_REKANAN, response: error.response })
                });
        })
    }
}