import axios from '../../../config/axios';
import * as glAccountCompanyTypes from '../../constants/glAccountCompanyTypes';

export const fetchGlAccountCompany = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('gl_account_company', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: glAccountCompanyTypes.SUCCESS_FETCH_GL_ACCOUNT_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: glAccountCompanyTypes.FAIL_FETCH_GL_ACCOUNT_COMPANY, response: error.response })
                });
        })
    }
}

export const showGlAccountCompany = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('gl_account_company/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: glAccountCompanyTypes.SUCCESS_SHOW_GL_ACCOUNT_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: glAccountCompanyTypes.FAIL_SHOW_GL_ACCOUNT_COMPANY, response: error.response })
                });
        })
    }
}

export const deleteGlAccountCompany = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('gl_account_company/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: glAccountCompanyTypes.SUCCESS_DELETE_GL_ACCOUNT_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: glAccountCompanyTypes.FAIL_DELETE_GL_ACCOUNT_COMPANY, response: error.response })
                });
        })
    }
}

export const saveGlAccountCompany = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('gl_account_company', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: glAccountCompanyTypes.SUCCESS_SAVE_GL_ACCOUNT_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: glAccountCompanyTypes.FAIL_SAVE_GL_ACCOUNT_COMPANY, response: error.response })
                });
        })
    }
}
export const updateGlAccountCompany = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('gl_account_company/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: glAccountCompanyTypes.SUCCESS_UPDATE_GL_ACCOUNT_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: glAccountCompanyTypes.FAIL_UPDATE_GL_ACCOUNT_COMPANY, response: error.response })
                });
        })
    }
}