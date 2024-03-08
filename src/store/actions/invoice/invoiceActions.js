import axios from '../../../config/axios';
import * as invoiceTypes from '../../constants/invoice/invoiceTypes';

export const fetchInvoice = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/invoice', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_FETCH_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_FETCH_INVOICE, response: error.response })
                });
        })
    }
}

export const fetchDocumentInvoice = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/invoice_document/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_FETCH_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_FETCH_INVOICE, response: error.response })
                });
        })
    }
}

export const showInvoice = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/invoice/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_SHOW_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: invoiceTypes.FAIL_SHOW_INVOICE, response: error.response })
                });
        })
    }
}

export const updateItemInvoice = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/invoice_update_item', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_UPDATE_ITEM_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_UPDATE_ITEM_INVOICE, response: error.response })
                });
        })
    }
}

export const saveInvoice = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/invoice', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_SAVE_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_SAVE_INVOICE, response: error.response })
                });
        })
    }
}

export const draftInvoice = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/invoice', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_SAVE_DRAFT_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_SAVE_DRAFT_INVOICE, response: error.response })
                });
        })
    }
}

export const submitInvoiceSAP = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/invoice/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_UPDATE_INVOICE_SAP,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_UPDATE_INVOICE_SAP, response: error.response })
                });
        })
    }
}

export const submitInvoice = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/invoice_submit/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_UPDATE_STATUS_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_UPDATE_STATUS_INVOICE, response: error.response })
                });
        })
    }
}

export const updateStatusInvoice = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/invoice_update_status/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_UPDATE_STATUS_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_UPDATE_STATUS_INVOICE, response: error.response })
                });
        })
    }
}

export const approveInvoice = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/invoice_approve/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_APPROVAL_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_APPROVAL_INVOICE, response: error.response })
                });
        })
    }
}

export const submitTransmittal = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/invoice_multiple_update_status', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_SUBMIT_TRANSMITTAL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_SUBMIT_TRANSMITTAL, response: error.response })
                });
        })
    }
}

export const updateTransmittal = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/invoice_submit_document/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_UPDATE_TRANSMITTAL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_UPDATE_TRANSMITTAL, response: error.response })
                });
        })
    }
}

export const updateAmountInvoice = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/invoice_update_header_amount/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_UPDATE_AMOUNT_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_UPDATE_AMOUNT_INVOICE, response: error.response })
                });
        })
    }
}

export const showSimulateInvoice = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/invoice_simulate/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_SHOW_SIMULATE_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: invoiceTypes.FAIL_SHOW_SIMULATE_INVOICE, response: error.response })
                });
        })
    }
}

export const cetakInvoice = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/checklist_document/'+uuid, {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_DOWNLOAD_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: invoiceTypes.FAIL_DOWNLOAD_INVOICE, response: error.response })
                });
        })
    }
}

export const postingInvoiceSAP = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/invoice_posting/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_POSTING_INVOICE_SAP,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_POSTING_INVOICE_SAP, response: error.response })
                });
        })
    }
}

export const scanFakturPajak = (id, parameter) => {
    let formData = new FormData();
    formData.append('file', parameter);
    formData.append('company_id', id);
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/invoice_scan_faktur_pajak', formData, {headers : {'Content-Type' : 'multipart/form-data'}})
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_SCAN_FAKTUR_PAJAK,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_SCAN_FAKTUR_PAJAK, response: error.response })
                });
        })
    }
}

export const fetchHistoryInvoice = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/invoice_history/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_FETCH_HISTORY_APPROVAL_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_FETCH_HISTORY_APPROVAL_INVOICE, response: error.response })
                });
        })
    }
}

export const uploadLampiranInvoice = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/invoice_document', parameter)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_UPLOAD_LAMPIRAN_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_UPLOAD_LAMPIRAN_INVOICE, response: error.response })
                });
        })
    }
}

export const fetchRekapTransmittalDocument = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/invoice/transmittal_document', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_FETCH_REKAP_TRANSMITTAL_DOCUMENT,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_FETCH_REKAP_TRANSMITTAL_DOCUMENT, response: error.response })
                });
        })
    }
}

export const fetchRekapTransmittalDocumentDetail = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/invoice/transmittal_document/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_FETCH_REKAP_TRANSMITTAL_DOCUMENT_DETAIL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_FETCH_REKAP_TRANSMITTAL_DOCUMENT_DETAIL, response: error.response })
                });
        })
    }
}

export const cetakRekapTransmittal = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/invoice/cetak_transmittal/'+uuid, {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_DOWNLOAD_REKAP_TRANSMITTAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: invoiceTypes.FAIL_DOWNLOAD_REKAP_TRANSMITTAL, response: error.response })
                });
        })
    }
}

export const generateTransmittal = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/generate_transmittal', parameter, {
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_GENERATE_LAMPIRAN_TRANSMITTAL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_GENERATE_LAMPIRAN_TRANSMITTAL, response: error.response })
                });
        })
    }
}

export const reverseInvoice = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/invoice_reverse/' + id, parameter)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_REVERSE_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_REVERSE_INVOICE, response: error.response })
                });
        })
    }
}

export const fetchTaxInvoice = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('w_holding_tax_sap', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_FETCH_TAX_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_FETCH_TAX_INVOICE, response: error.response })
                });
        })
    }
}

export const syncInvoicePaid = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/invoice_paid')
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_SYNC_STATUS_PAID,
                        data: response.data
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_SYNC_STATUS_PAID, response: error.response })
                });
        })
    }
}

export const deleteLampiranInvoice = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('invoice/invoice_attachment/' + id,)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_DELETE_LAMPIRAN_PENDUKUNG,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: invoiceTypes.FAIL_DELETE_LAMPIRAN_PENDUKUNG, response: error.response })
                });
        })
    }
}

export const exportExcelInvoice = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/invoice_export_excel', {
                params: parameter, responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_EXPORT_EXCEL_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_EXPORT_EXCEL_INVOICE, response: error.response })
                });
        })
    }
}

export const fetchPenaltyInvoice = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/invoice_penalty', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_FETCH_PENALTY_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_FETCH_PENALTY_INVOICE, response: error.response })
                });
        })
    }
}

export const savePenaltyInvoice = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/invoice_penalty', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_SAVE_PENALTY_INVOICE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_SAVE_PENALTY_INVOICE, response: error.response })
                });
        })
    }
}

export const updatePenaltyInvoice = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/invoice_penalty', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_UPDATE_PENALTY_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: invoiceTypes.FAIL_UPDATE_PENALTY_INVOICE, response: error.response })
                });
        })
    }
}

export const deletePenaltyInvoice = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('invoice/invoice_penalty/' + id,)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: invoiceTypes.SUCCESS_DELETE_PENALTY_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: invoiceTypes.FAIL_DELETE_PENALTY_INVOICE, response: error.response })
                });
        })
    }
}

