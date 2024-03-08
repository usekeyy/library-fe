import axios from '../../../config/axios';
import * as prSourceDeterminateSapTypes from '../../constants/tendering/prSourceDeterminateSapTypes';

export const fetchPrSourceDeterminateSap = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/src_determination_sap', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: prSourceDeterminateSapTypes.SUCCESS_FETCH_LIST_PR_SOURCE_DETERMINATE_SAP,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: prSourceDeterminateSapTypes.FAIL_FETCH_LIST_PR_SOURCE_DETERMINATE_SAP, response: error.response })
                });
        })
    }
}

export const getDetailPrSourceDeterminateSap = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/src_determination_sap/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: prSourceDeterminateSapTypes.SUCCESS_GET_DETAIL_PR_SOURCE_DETERMINATE_SAP,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: prSourceDeterminateSapTypes.FAIL_GET_DETAIL_PR_SOURCE_DETERMINATE_SAP, response: error.response })
                });
        })
    }
}

export const putPrSourceDeterminateSap = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/src_determination_sap/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: prSourceDeterminateSapTypes.FAIL_PUT_PR_SOURCE_DETERMINATE_SAP,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: prSourceDeterminateSapTypes.FAIL_PUT_PR_SOURCE_DETERMINATE_SAP, response: error.response })
                });
        })
    }
}