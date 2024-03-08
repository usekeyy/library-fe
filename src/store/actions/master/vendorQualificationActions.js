import axios from '../../../config/axios';
import * as vendorQualificationTypes from '../../constants/vendorQualificationTypes';

export const fetchVendorQualification = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor_qualifications', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorQualificationTypes.SUCCESS_FETCH_VENDOR_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorQualificationTypes.FAIL_FETCH_VENDOR_QUALIFICATION, response: error.response })
                });
        })
    }
}

export const showVendorQualification = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor_qualifications/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorQualificationTypes.SUCCESS_SHOW_VENDOR_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorQualificationTypes.FAIL_SHOW_VENDOR_QUALIFICATION, response: error.response })
                });
        })
    }
}

export const deleteVendorQualification = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor_qualifications/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorQualificationTypes.SUCCESS_DELETE_VENDOR_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorQualificationTypes.FAIL_DELETE_VENDOR_QUALIFICATION, response: error.response })
                });
        })
    }
}

export const saveVendorQualification = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor_qualifications', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorQualificationTypes.SUCCESS_SAVE_VENDOR_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorQualificationTypes.FAIL_SAVE_VENDOR_QUALIFICATION, response: error.response })
                });
        })
    }
}
export const updateVendorQualification = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor_qualifications/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vendorQualificationTypes.SUCCESS_UPDATE_VENDOR_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vendorQualificationTypes.SUCCESS_UPDATE_VENDOR_QUALIFICATION, response: error.response })
                });
        })
    }
}