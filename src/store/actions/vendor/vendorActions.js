import axios from '../../../config/axios';
import * as currenciesType from '../../constants/vendor/vendorTypes';

export const fetchVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_VENDOR, response: error.response })
                });
        })
    }
}

export const fetchDataVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/get_vendor_table', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_DATA_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_DATA_VENDOR, response: error.response })
                });
        })
    }
}

export const getListDokumenExpired = (uuid,parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/expired_document/${uuid}`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_DOKUMEN_EXPIRED,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_DOKUMEN_EXPIRED, response: error.response })
                });
        })
    }
}

export const downloadProfilVendor = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/excel_profil_vendor/'+uuid,{
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_DOWNLOAD_PROFIL_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_DOWNLOAD_PROFIL_VENDOR, response: error.response })
                });
        })
    }
}



