import axios from '../../../config/axios';
import * as currenciesType from '../../constants/vendor/extendCompanyTypes';

export const fetchExtendCompany = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/ajuan_extend_company', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_EXTEND_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_EXTEND_COMPANY, response: error.response })
                });
        })
    }
}

export const showExtendCompany = (vendor_uuid, params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/ajuan_extend_company/vendor/${vendor_uuid}/extended`, {
								params: params
						})
						.then(response => {
								resolve(response);
								dispatch({
										type: currenciesType.SUCCESS_SHOW_EXTEND_COMPANY,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: currenciesType.FAIL_SHOW_EXTEND_COMPANY, response: error.response })
						});
        })
    }
}


export const saveExtendCompany = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/ajuan_extend_company/', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_SAVE_EXTEND_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.SUCCESS_SAVE_EXTEND_COMPANY, response: error.response })
                });
        })
    }
}

export const updateExtendCompany = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/ajuan_extend_company/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_UPDATE_EXTEND_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.SUCCESS_UPDATE_EXTEND_COMPANY, response: error.response })
                });
        })
    }
}