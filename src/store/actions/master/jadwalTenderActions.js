import axios from '../../../config/axios';
import * as jadwalTenderTypes from '../../constants/jadwalTenderTypes';

export const fetchJadwalTender = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/jadwal_tender', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: jadwalTenderTypes.SUCCESS_FETCH_JADWAL_TENDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: jadwalTenderTypes.FAIL_FETCH_JADWAL_TENDER, response: error.response })
                });
        })
    }
}

export const showJadwalTender = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/jadwal_tender/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: jadwalTenderTypes.SUCCESS_SHOW_JADWAL_TENDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: jadwalTenderTypes.FAIL_SHOW_JADWAL_TENDER, response: error.response })
                });
        })
    }
}

export const deleteJadwalTender = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/jadwal_tender/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: jadwalTenderTypes.SUCCESS_DELETE_JADWAL_TENDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: jadwalTenderTypes.FAIL_DELETE_JADWAL_TENDER, response: error.response })
                });
        })
    }
}

export const saveJadwalTender = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/jadwal_tender', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: jadwalTenderTypes.SUCCESS_SAVE_JADWAL_TENDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: jadwalTenderTypes.FAIL_SAVE_JADWAL_TENDER, response: error.response })
                });
        })
    }
}
export const updateJadwalTender = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/jadwal_tender/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: jadwalTenderTypes.SUCCESS_UPDATE_JADWAL_TENDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: jadwalTenderTypes.SUCCESS_UPDATE_JADWAL_TENDER, response: error.response })
                });
        })
    }
}