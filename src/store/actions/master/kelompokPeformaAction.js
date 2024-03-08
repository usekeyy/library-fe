import axios from '../../../config/axios';
import * as actionTypes from '../../constants/kelompokPeformaTypes';

export const fetchKelompokPeforma = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            console.log(parameter)
            axios.get('/vendor_management/klasifikasi_performa', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_KELOMPOKPEFORMA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_KELOMPOKPEFORMA, response: error.response })
                });
        })
    }
}

export const showKelompokPeforma = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/vendor_management/klasifikasi_performa/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SHOW_KELOMPOKPEFORMA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SHOW_KELOMPOKPEFORMA, response: error.response })
                });
        })
    }
}

export const deleteKelompokPeforma = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/vendor_management/klasifikasi_performa/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_KELOMPOKPEFORMA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_KELOMPOKPEFORMA, response: error.response })
                });
        })
    }
}

export const saveKelompokPeforma = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/vendor_management/klasifikasi_performa', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_KELOMPOKPEFORMA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_SAVE_KELOMPOKPEFORMA, response: error.response })
                });
        })
    }
}
export const updateKelompokPeforma = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/vendor_management/klasifikasi_performa/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_KELOMPOKPEFORMA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_UPDATE_KELOMPOKPEFORMA, response: error.response })
                });
        })
    }
}