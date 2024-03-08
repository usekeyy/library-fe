import axios from '../../../config/axios';
import * as glAccountTypes from '../../constants/glAccountTypes';

export const fetchGlAccount = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('gl_account', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: glAccountTypes.SUCCESS_FETCH_GL_ACCOUNT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: glAccountTypes.FAIL_FETCH_GL_ACCOUNT, response: error.response })
                });
        })
    }
}

export const showGlAccount = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('gl_account/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: glAccountTypes.SUCCESS_SHOW_GL_ACCOUNT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: glAccountTypes.FAIL_SHOW_GL_ACCOUNT, response: error.response })
                });
        })
    }
}

export const deleteGlAccount = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('gl_account/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: glAccountTypes.SUCCESS_DELETE_GL_ACCOUNT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: glAccountTypes.FAIL_DELETE_GL_ACCOUNT, response: error.response })
                });
        })
    }
}

export const saveGlAccount = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('gl_account', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: glAccountTypes.SUCCESS_SAVE_GL_ACCOUNT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: glAccountTypes.FAIL_SAVE_GL_ACCOUNT, response: error.response })
                });
        })
    }
}
export const updateGlAccount = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('gl_account/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: glAccountTypes.SUCCESS_UPDATE_GL_ACCOUNT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: glAccountTypes.FAIL_UPDATE_GL_ACCOUNT, response: error.response })
                });
        })
    }
}