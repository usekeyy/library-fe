import axios from '../../../config/axios';
import * as companyTypes from '../../constants/companyTypes';

export const fetchCompanyType = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/company_type', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: companyTypes.SUCCESS_FETCH_COMPANY_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: companyTypes.FAIL_FETCH_COMPANY_TYPE, response: error.response })
                });
        })
    }
}

export const showCompanyType = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/company_type/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: companyTypes.SUCCESS_SHOW_COMPANY_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: companyTypes.FAIL_SHOW_COMPANY_TYPE, response: error.response })
                });
        })
    }
}

export const deleteCompanyType = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/company_type/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: companyTypes.SUCCESS_DELETE_COMPANY_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: companyTypes.FAIL_DELETE_COMPANY_TYPE, response: error.response })
                });
        })
    }
}

export const saveCompanyType = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/company_type', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: companyTypes.SUCCESS_SAVE_COMPANY_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: companyTypes.FAIL_SAVE_COMPANY_TYPE, response: error.response })
                });
        })
    }
}
export const updateCompanyType = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/company_type/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: companyTypes.SUCCESS_UPDATE_COMPANY_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: companyTypes.FAIL_UPDATE_COMPANY_TYPE, response: error.response })
                });
        })
    }
}