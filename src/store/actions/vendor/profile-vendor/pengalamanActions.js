import axios from '../../../../config/axios';
import * as pengalamanTypes from '../../../constants/vendor/pengalamanTypes';

export const fetchPengalaman = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/vendor/${id}/pengalaman`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pengalamanTypes.SUCCESS_FETCH_PENGALAMAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pengalamanTypes.FAIL_FETCH_PENGALAMAN, response: error.response })
                });
        })
    }
}


export const showPengalaman = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor/' + vendor_uuid + '/pengalaman/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pengalamanTypes.SUCCESS_SHOW_PENGALAMAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pengalamanTypes.FAIL_SHOW_PENGALAMAN, response: error.response })
                });
        })
    }
}

export const deletePengalaman = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor/' + vendor_uuid + '/pengalaman/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pengalamanTypes.SUCCESS_DELETE_PENGALAMAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pengalamanTypes.FAIL_DELETE_PENGALAMAN, response: error.response })
                });
        })
    }
}

export const savePengalaman = (vendor_uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor/' + vendor_uuid + '/pengalaman', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pengalamanTypes.SUCCESS_SAVE_PENGALAMAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pengalamanTypes.FAIL_SAVE_PENGALAMAN, response: error.response })
                });
        })
    }
}
export const updatePengalaman = (vendor_uuid, uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor/' + vendor_uuid + '/pengalaman/' + uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: pengalamanTypes.SUCCESS_UPDATE_PENGALAMAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: pengalamanTypes.FAIL_UPDATE_PENGALAMAN, response: error.response })
                });
        })
    }
}