import axios from '../../../config/axios';
import * as vendorClasificationTypes from '../../constants/vendorClasificationTypes';

export const fetchVendorClassification = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor_classifications', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorClasificationTypes.SUCCESS_FETCH_VENDOR_CLASSIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorClasificationTypes.FAIL_FETCH_VENDOR_CLASSIFICATION, response: error.response })
                });
        })
    }
}

export const showVendorClassification = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor_classifications/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorClasificationTypes.SUCCESS_SHOW_VENDOR_CLASSIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorClasificationTypes.FAIL_SHOW_VENDOR_CLASSIFICATION, response: error.response })
                });
        })
    }
}

export const deleteVendorClassification = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor_classifications/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorClasificationTypes.SUCCESS_DELETE_VENDOR_CLASSIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorClasificationTypes.FAIL_DELETE_VENDOR_CLASSIFICATION, response: error.response })
                });
        })
    }
}

export const saveVendorClassification = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor_classifications', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorClasificationTypes.SUCCESS_SAVE_VENDOR_CLASSIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorClasificationTypes.FAIL_SAVE_VENDOR_CLASSIFICATION, response: error.response })
                });
        })
    }
}
export const updateVendorClassification = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor_classifications/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorClasificationTypes.SUCCESS_UPDATE_VENDOR_CLASSIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorClasificationTypes.SUCCESS_UPDATE_VENDOR_CLASSIFICATION, response: error.response })
                });
        })
    }
}