import axios from '../../../config/axios';
import * as currenciesType from '../../constants/vendor/approvalExtendCompanyTypes';

export const fetchApprovalExtendCompany = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/approval_extend_company', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_APPROVAL_EXTEND_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_APPROVAL_EXTEND_COMPANY, response: error.response })
                });
        })
    }
}

export const showApprovalExtendCompany = (uuid, params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/approval_extend_company/list_vendor_extended_company/${uuid}`, { params: params })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_SHOW_APPROVAL_EXTEND_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_SHOW_APPROVAL_EXTEND_COMPANY, response: error.response })
                });
        })
    }
}

export const updateApprovalExtendCompany = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/approval_extend_company/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_UPDATE_APPROVAL_EXTEND_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.SUCCESS_UPDATE_APPROVAL_EXTEND_COMPANY, response: error.response })
                });
        })
    }
}