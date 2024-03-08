import axios from '../../../config/axios';
import * as punishmentVendorTypes from '../../constants/vendor/punishmentVendorTypes';

export const fetchPunishmentVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/punishment_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: punishmentVendorTypes.SUCCESS_FETCH_PUNISHMENT_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: punishmentVendorTypes.FAIL_FETCH_PUNISHMENT_VENDOR, response: error.response })
                });
        })
    }
}

export const showPunishmentVendor = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/punishment_vendor/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: punishmentVendorTypes.SUCCESS_SHOW_PUNISHMENT_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: punishmentVendorTypes.FAIL_SHOW_PUNISHMENT_VENDOR, response: error.response })
                });
        })
    }
}

export const savePunishmentVendor = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/punishment_vendor', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: punishmentVendorTypes.SUCCESS_SAVE_PUNISHMENT_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: punishmentVendorTypes.FAIL_SAVE_PUNISHMENT_VENDOR, response: error.response })
                });
        })
    }
}
export const updatePunishmentVendor = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/punishment_vendor/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: punishmentVendorTypes.SUCCESS_UPDATE_PUNISHMENT_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: punishmentVendorTypes.FAIL_UPDATE_PUNISHMENT_VENDOR, response: error.response })
                });
        })
    }
}
export const verifikasiPunishmentVendor = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/approve_punishment_vendor/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: punishmentVendorTypes.SUCCESS_VERIFY_PUNISHMENT_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: punishmentVendorTypes.FAIL_VERIFY_PUNISHMENT_VENDOR, response: error.response })
                });
        })
    }
}
export const fetchDataVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/not_punished_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: punishmentVendorTypes.SUCCESS_FETCH_DATA_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: punishmentVendorTypes.FAIL_FETCH_DATA_VENDOR, response: error.response })
                });
        })
    }
}

