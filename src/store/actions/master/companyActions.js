import axios from '../../../config/axios';
import * as companyTypes from '../../constants/companyTypes';

export const fetchCompanies = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('book', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: companyTypes.SUCCESS_FETCH_COMPANY,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: companyTypes.FAIL_FETCH_COMPANY, response: error.response })
                });
        })
    }
}

export const showCompanies = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('book/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: companyTypes.SUCCESS_SHOW_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: companyTypes.FAIL_SHOW_COMPANY, response: error.response })
                });
        })
    }
}

export const deleteCompanies = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('book/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: companyTypes.SUCCESS_DELETE_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: companyTypes.FAIL_DELETE_COMPANY, response: error.response })
                });
        })
    }
}

export const saveCompanies = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('book', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: companyTypes.SUCCESS_SAVE_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: companyTypes.FAIL_SAVE_COMPANY, response: error.response })
                });
        })
    }
}
export const updateCompanies = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('book/' + id,payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: companyTypes.SUCCESS_UPDATE_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: companyTypes.FAIL_UPDATE_COMPANY, response: error.response })
                });
        })
    }
}