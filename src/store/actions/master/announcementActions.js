import axios from '../../../config/axios';
import * as announcementTypes from '../../constants/announcementTypes';

export const fetchAnnouncement = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('announcement', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: announcementTypes.SUCCESS_FETCH_ANNOUNCEMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: announcementTypes.FAIL_FETCH_ANNOUNCEMENT, response: error.response })
                });
        })
    }
}

export const showAnnouncement = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('announcement/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: announcementTypes.SUCCESS_SHOW_ANNOUNCEMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: announcementTypes.FAIL_SHOW_ANNOUNCEMENT, response: error.response })
                });
        })
    }
}

export const deleteAnnouncement = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('announcement/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: announcementTypes.SUCCESS_DELETE_ANNOUNCEMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: announcementTypes.FAIL_DELETE_ANNOUNCEMENT, response: error.response })
                });
        })
    }
}

export const saveAnnouncement = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('announcement', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: announcementTypes.SUCCESS_SAVE_ANNOUNCEMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: announcementTypes.FAIL_SAVE_ANNOUNCEMENT, response: error.response })
                });
        })
    }
}
export const updateAnnouncement = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('announcement/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: announcementTypes.SUCCESS_UPDATE_ANNOUNCEMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: announcementTypes.FAIL_UPDATE_ANNOUNCEMENT, response: error.response })
                });
        })
    }
}
// konfigurasi pendaftaran vendor mandiri
export const fetchKonfigurasi = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/registration_config', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: announcementTypes.SUCCESS_FETCH_KONFIGURASI_PENDAFTARAN_VENDOR_MANDIRI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: announcementTypes.FAIL_FETCH_KONFIGURASI_PENDAFTARAN_VENDOR_MANDIRI, response: error.response })
                });
        })
    }
}

export const saveKonfigurasi = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/registration_config', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: announcementTypes.SUCCESS_SAVE_KONFIGURASI_PENDAFTARAN_VENDOR_MANDIRI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: announcementTypes.FAIL_SAVE_KONFIGURASI_PENDAFTARAN_VENDOR_MANDIRI, response: error.response })
                });
        })
    }
}

export const fetchKonfigurasiShow = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/registration_config/active')
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: announcementTypes.SUCCESS_FETCH_SHOW_KONFIGURASI_PENDAFTARAN_VENDOR_MANDIRI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: announcementTypes.FAIL_FETCH_SHOW_KONFIGURASI_PENDAFTARAN_VENDOR_MANDIRI, response: error.response })
                });
        })
    }
}