import axios from '../../../config/axios';
import * as createLOAType from '../../constants/expediting/createLOAType';

export const createLOA = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/purchase_order/create_loa/'+id , payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: createLOAType.SUCCESS_FETCH_CREATE_LOA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: createLOAType.FAIL_FETCH_CREATE_LOA, response: error.response })
                });
        })
    }
}

export const generatePDFLOA = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/purchase_order/generate_loa/'+id,{
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: createLOAType.SUCCESS_SHOW_GENERATE_PDF_CREATE_LOA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: createLOAType.FAIL_SHOW_GENERATE_PDF_CREATE_LOA, response: error.response })
                });
        })
    }
}

// tendering/po_loa_show/{uuid}

export const showDetailLoa = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/po_loa_show/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: createLOAType.SUCCESS_SHOW_DETAIL_PO_LOA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: createLOAType.FAIL_SHOW_DETAIL_PO_LOA, response: error.response })
                });
        })
    }
}

export const approvalLOA = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/po_loa_approve_cancel/'+id , payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: createLOAType.SUCCESS_APPROVAL_PO_LOA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: createLOAType.FAIL_APPROVAL_PO_LOA, response: error.response })
                });
        })
    }
}