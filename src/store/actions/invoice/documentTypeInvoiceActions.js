import axios from '../../../config/axios';
import * as documentTypeInvoiceTypes from '../../constants/invoice/documentTypeInvoiceTypes';

export const fetchDocumentTypeInvoice = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('doc_type_inv', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentTypeInvoiceTypes.SUCCESS_FETCH_DOCUMENT_TYPE_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentTypeInvoiceTypes.FAIL_FETCH_DOCUMENT_TYPE_INVOICE, response: error.response })
                });
        })
    }
}

export const showDocumentTypeInvoice = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('doc_type_inv/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentTypeInvoiceTypes.SUCCESS_SHOW_DOCUMENT_TYPE_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentTypeInvoiceTypes.FAIL_SHOW_DOCUMENT_TYPE_INVOICE, response: error.response })
                });
        })
    }
}

export const deleteDocumentTypeInvoice = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('doc_type_inv/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentTypeInvoiceTypes.SUCCESS_DELETE_DOCUMENT_TYPE_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentTypeInvoiceTypes.FAIL_DELETE_DOCUMENT_TYPE_INVOICE, response: error.response })
                });
        })
    }
}

export const saveDocumentTypeInvoice = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('doc_type_inv', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentTypeInvoiceTypes.SUCCESS_SAVE_DOCUMENT_TYPE_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentTypeInvoiceTypes.FAIL_SAVE_DOCUMENT_TYPE_INVOICE, response: error.response })
                });
        })
    }
}
export const updateDocumentTypeInvoice = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('doc_type_inv/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentTypeInvoiceTypes.SUCCESS_UPDATE_DOCUMENT_TYPE_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentTypeInvoiceTypes.SUCCESS_UPDATE_DOCUMENT_TYPE_INVOICE, response: error.response })
                });
        })
    }
}
export const syncDocumentTypeInvoice = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_doc_type_inv', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: documentTypeInvoiceTypes.SUCCESS_SYNC_DOCUMENT_TYPE_INVOICE,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: documentTypeInvoiceTypes.FAIL_SYNC_DOCUMENT_TYPE_INVOICE, response: error.response })
						});
        })
    }
}
