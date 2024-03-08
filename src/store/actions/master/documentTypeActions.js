import axios from '../../../config/axios';
import * as documentTypeType from '../../constants/documentTypeTypes';

export const fetchDocumentType = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('document_type', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentTypeType.SUCCESS_FETCH_DOCUMENT_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentTypeType.FAIL_FETCH_DOCUMENT_TYPE, response: error.response })
                });
        })
    }
}

export const showDocumentType = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('document_type/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentTypeType.SUCCESS_SHOW_DOCUMENT_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentTypeType.FAIL_SHOW_DOCUMENT_TYPE, response: error.response })
                });
        })
    }
}

export const deleteDocumentType = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('document_type/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentTypeType.SUCCESS_DELETE_DOCUMENT_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentTypeType.FAIL_DELETE_DOCUMENT_TYPE, response: error.response })
                });
        })
    }
}

export const saveDocumentType = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('document_type', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentTypeType.SUCCESS_SAVE_DOCUMENT_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentTypeType.FAIL_SAVE_DOCUMENT_TYPE, response: error.response })
                });
        })
    }
}
export const updateDocumentType = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('document_type/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentTypeType.SUCCESS_UPDATE_DOCUMENT_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentTypeType.FAIL_UPDATE_DOCUMENT_TYPE, response: error.response })
                });
        })
    }
}
export const syncDocumentType = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_document_type', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: documentTypeType.SUCCESS_SYNC_DOCUMENT_TYPE,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: documentTypeType.FAIL_SYNC_DOCUMENT_TYPE, response: error.response })
						});
        })
    }
}
