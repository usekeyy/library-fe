import axios from '../../../config/axios';
import * as openPunishmentVendorTypes from '../../constants/vendor/openPunishmentVendorTypes';

export const fetchOpenPunishmentVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/open_punishment_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: openPunishmentVendorTypes.SUCCESS_FETCH_OPEN_PUNISHMENT_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: openPunishmentVendorTypes.FAIL_FETCH_OPEN_PUNISHMENT_VENDOR, response: error.response })
                });
        })
    }
}

export const showOpenPunishmentVendor = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/open_punishment_vendor/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: openPunishmentVendorTypes.SUCCESS_SHOW_OPEN_PUNISHMENT_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: openPunishmentVendorTypes.FAIL_SHOW_OPEN_PUNISHMENT_VENDOR, response: error.response })
                });
        })
    }
}

export const saveOpenPunishmentVendor = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/open_punishment_vendor', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: openPunishmentVendorTypes.SUCCESS_SAVE_OPEN_PUNISHMENT_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: openPunishmentVendorTypes.FAIL_SAVE_OPEN_PUNISHMENT_VENDOR, response: error.response })
                });
        })
    }
}
export const updateOpenPunishmentVendor = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/open_punishment_vendor/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: openPunishmentVendorTypes.SUCCESS_UPDATE_OPEN_PUNISHMENT_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: openPunishmentVendorTypes.FAIL_UPDATE_OPEN_PUNISHMENT_VENDOR, response: error.response })
                });
        })
    }
}
export const verifikasiOpenPunishmentVendor = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/approve_open_punishment_vendor/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: openPunishmentVendorTypes.SUCCESS_VERIFY_OPEN_PUNISHMENT_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: openPunishmentVendorTypes.FAIL_VERIFY_OPEN_PUNISHMENT_VENDOR, response: error.response })
                });
        })
    }
}