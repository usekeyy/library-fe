import axios from '../../../../config/axios';
import * as documentPajakTypes from '../../../constants/vendor/documentPajakTypes';

export const fetchPajakFiskal = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/vendor/${id}/dokumen_fiskal`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentPajakTypes.SUCCESS_FETCH_DOC_PAJAK_FISKAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentPajakTypes.FAIL_FETCH_DOC_PAJAK_FISKAL, response: error.response })
                });
        })
    }
}


export const showPajakFiskal = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor/' + vendor_uuid + '/dokumen_fiskal/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentPajakTypes.SUCCESS_SHOW_DOC_PAJAK_FISKAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentPajakTypes.FAIL_SHOW_DOC_PAJAK_FISKAL, response: error.response })
                });
        })
    }
}

export const deletePajakFiskal = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor/' + vendor_uuid + '/dokumen_fiskal/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentPajakTypes.SUCCESS_DELETE_DOC_PAJAK_FISKAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentPajakTypes.FAIL_DELETE_DOC_PAJAK_FISKAL, response: error.response })
                });
        })
    }
}

export const savePajakFiskal = (vendor_uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor/' + vendor_uuid + '/dokumen_fiskal', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentPajakTypes.SUCCESS_SAVE_DOC_PAJAK_FISKAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentPajakTypes.FAIL_SAVE_DOC_PAJAK_FISKAL, response: error.response })
                });
        })
    }
}
export const updatePajakFiskal = (vendor_uuid, uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor/' + vendor_uuid + '/dokumen_fiskal/' + uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentPajakTypes.SUCCESS_UPDATE_DOC_PAJAK_FISKAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentPajakTypes.FAIL_UPDATE_DOC_PAJAK_FISKAL, response: error.response })
                });
        })
    }
}