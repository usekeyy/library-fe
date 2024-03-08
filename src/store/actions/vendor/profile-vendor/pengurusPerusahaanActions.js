import axios from '../../../../config/axios';
import * as pengurusPerusahaanTypes from '../../../constants/vendor/pengurusPerusahaanTypes';

export const fetchPengurusPerusahaan = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/vendor/${id}/pengurus`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pengurusPerusahaanTypes.SUCCESS_FETCH_PENGURUS_PERUSAHAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pengurusPerusahaanTypes.FAIL_FETCH_PENGURUS_PERUSAHAAN, response: error.response })
                });
        })
    }
}

export const showPengurusPerusahaan = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor/' + vendor_uuid + '/pengurus/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pengurusPerusahaanTypes.SUCCESS_SHOW_PENGURUS_PERUSAHAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pengurusPerusahaanTypes.FAIL_SHOW_PENGURUS_PERUSAHAAN, response: error.response })
                });
        })
    }
}

export const deletePengurusPerusahaan = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor/' + vendor_uuid + '/pengurus/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pengurusPerusahaanTypes.SUCCESS_DELETE_PENGURUS_PERUSAHAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pengurusPerusahaanTypes.FAIL_DELETE_PENGURUS_PERUSAHAAN, response: error.response })
                });
        })
    }
}

export const savePengurusPerusahaan = (vendor_uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor/' + vendor_uuid + '/pengurus', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pengurusPerusahaanTypes.SUCCESS_SAVE_PENGURUS_PERUSAHAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pengurusPerusahaanTypes.FAIL_SAVE_PENGURUS_PERUSAHAAN, response: error.response })
                });
        })
    }
}
export const updatePengurusPerusahaan = (vendor_uuid, uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor/' + vendor_uuid + '/pengurus/' + uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pengurusPerusahaanTypes.SUCCESS_UPDATE_PENGURUS_PERUSAHAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pengurusPerusahaanTypes.FAIL_UPDATE_PENGURUS_PERUSAHAAN, response: error.response })
                });
        })
    }
}