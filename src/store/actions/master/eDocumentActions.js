import axios from '../../../config/axios';
import * as eDocumentTypes from '../../constants/eDocumentTypes';

export const fetchEDocument = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('e_document', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: eDocumentTypes.SUCCESS_FETCH_E_DOCUMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: eDocumentTypes.FAIL_FETCH_E_DOCUMENT, response: error.response })
                });
        })
    }
}

export const showEDocument = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('e_document/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: eDocumentTypes.SUCCESS_SHOW_E_DOCUMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: eDocumentTypes.FAIL_SHOW_E_DOCUMENT, response: error.response })
                });
        })
    }
}

export const deleteEDocument = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('e_document/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: eDocumentTypes.SUCCESS_DELETE_E_DOCUMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: eDocumentTypes.FAIL_DELETE_E_DOCUMENT, response: error.response })
                });
        })
    }
}

export const saveEDocument = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('e_document', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: eDocumentTypes.SUCCESS_SAVE_E_DOCUMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: eDocumentTypes.FAIL_SAVE_E_DOCUMENT, response: error.response })
                });
        })
    }
}
export const updateEDocument = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('e_document/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: eDocumentTypes.SUCCESS_UPDATE_E_DOCUMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: eDocumentTypes.FAIL_UPDATE_E_DOCUMENT, response: error.response })
                });
        })
    }
}