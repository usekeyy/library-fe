import axios from '../../../config/axios';
import * as actionTypes from '../../constants/userHasSapTypes';

export const fetchUserSap = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('user_has_sap', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_USER_HAS_SAP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_USER_HAS_SAP, response: error.response })
                });
        })
    }
}

export const showUserSap = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('user_has_sap/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SHOW_USER_HAS_SAP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SHOW_USER_HAS_SAP, response: error.response })
                });
        })
    }
}

export const deleteUserSap= (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('user_has_sap/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_USER_HAS_SAP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_USER_HAS_SAP, response: error.response })
                });
        })
    }
}

export const saveUserSap = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('user_has_sap', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_USER_HAS_SAP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_SAVE_USER_HAS_SAP, response: error.response })
                });
        })
    }
}
export const updateUserSap = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('user_has_sap/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_USER_HAS_SAP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_UPDATE_USER_HAS_SAP, response: error.response })
                });
        })
    }
}

export const fetchUser = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('user', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_USER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_USER, response: error.response })
                });
        })
    }
}