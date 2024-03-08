import axios from '../../../../config/axios';
import * as mesinPerusahaanTypes from '../../../constants/vendor/mesinPerusahaanTypes';

export const fetchMesinPerusahaan = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/vendor/${id}/mesin_perusahaan`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: mesinPerusahaanTypes.SUCCESS_FETCH_MESIN_PERUSAHAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: mesinPerusahaanTypes.FAIL_FETCH_MESIN_PERUSAHAAN, response: error.response })
                });
        })
    }
}


export const showMesinPerusahaan = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor/' + vendor_uuid + '/mesin_perusahaan/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: mesinPerusahaanTypes.SUCCESS_SHOW_MESIN_PERUSAHAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: mesinPerusahaanTypes.FAIL_SHOW_MESIN_PERUSAHAAN, response: error.response })
                });
        })
    }
}

export const deleteMesinPerusahaan = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor/' + vendor_uuid + '/mesin_perusahaan/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: mesinPerusahaanTypes.SUCCESS_DELETE_MESIN_PERUSAHAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: mesinPerusahaanTypes.FAIL_DELETE_MESIN_PERUSAHAAN, response: error.response })
                });
        })
    }
}

export const saveMesinPerusahaan = (vendor_uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor/' + vendor_uuid + '/mesin_perusahaan', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: mesinPerusahaanTypes.SUCCESS_SAVE_MESIN_PERUSAHAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: mesinPerusahaanTypes.FAIL_SAVE_MESIN_PERUSAHAAN, response: error.response })
                });
        })
    }
}
export const updateMesinPerusahaan = (vendor_uuid, uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor/' + vendor_uuid + '/mesin_perusahaan/' + uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: mesinPerusahaanTypes.SUCCESS_UPDATE_MESIN_PERUSAHAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: mesinPerusahaanTypes.FAIL_UPDATE_MESIN_PERUSAHAAN, response: error.response })
                });
        })
    }
}