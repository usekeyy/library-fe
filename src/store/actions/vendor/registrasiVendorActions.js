import axios from '../../../config/axios';
import * as actionTypes from '../../constants/vendor/registrasiVendorTypes';

export const fetchRegistrasiVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_REGISTRASI_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_REGISTRASI_VENDOR, response: error.response })
                });
        })
    }
}

export const showRegistrasiVendor = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SHOW_REGISTRASI_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SHOW_REGISTRASI_VENDOR, response: error.response })
                });
        })
    }
}

export const saveRegistrasiVendor = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_REGISTRASI_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_SAVE_REGISTRASI_VENDOR, response: error.response })
                });
        })
    }
}