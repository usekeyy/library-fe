import axios from '../../../config/axios';
import * as vendorSubClasificationTypes from '../../constants/vendorSubClasificationTypes';

export const fetchVendorSubClassification = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor_sub_classification', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorSubClasificationTypes.SUCCESS_FETCH_VENDOR_SUB_CLASSIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorSubClasificationTypes.FAIL_FETCH_VENDOR_SUB_CLASSIFICATION, response: error.response })
                });
        })
    }
}

export const showVendorSubClassification = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor_sub_classification/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorSubClasificationTypes.SUCCESS_SHOW_VENDOR_SUB_CLASSIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorSubClasificationTypes.FAIL_SHOW_VENDOR_SUB_CLASSIFICATION, response: error.response })
                });
        })
    }
}

export const deleteVendorSubClassification = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor_sub_classification/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorSubClasificationTypes.SUCCESS_DELETE_VENDOR_SUB_CLASSIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorSubClasificationTypes.FAIL_DELETE_VENDOR_SUB_CLASSIFICATION, response: error.response })
                });
        })
    }
}

export const saveVendorSubClassification = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor_sub_classification', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorSubClasificationTypes.SUCCESS_SAVE_VENDOR_SUB_CLASSIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorSubClasificationTypes.FAIL_SAVE_VENDOR_SUB_CLASSIFICATION, response: error.response })
                });
        })
    }
}
export const updateVendorSubClassification = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor_sub_classification/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorSubClasificationTypes.SUCCESS_UPDATE_VENDOR_SUB_CLASSIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorSubClasificationTypes.SUCCESS_UPDATE_VENDOR_SUB_CLASSIFICATION, response: error.response })
                });
        })
    }
}