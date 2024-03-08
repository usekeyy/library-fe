import axios from '../../../config/axios';
import * as actionTypes from '../../constants/vendor/verificationRequestorTypes';

export const fetchVerificationRequestor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_VERIFICATION_REQUESTOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_VERIFICATION_REQUESTOR, response: error.response })
                });
        })
    }
}

export const showVerificationRequestor = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SHOW_VERIFICATION_REQUESTOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SHOW_VERIFICATION_REQUESTOR, response: error.response })
                });
        })
    }
}

export const saveVerificationRequestor = (uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`vendor/verification_from_requestor/${uuid}`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_VERIFICATION_REQUESTOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_SAVE_VERIFICATION_REQUESTOR, response: error.response })
                });
        })
    }
}