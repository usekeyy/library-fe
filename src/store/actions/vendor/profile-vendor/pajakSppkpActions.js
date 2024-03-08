import axios from '../../../../config/axios';
import * as documentPajakTypes from '../../../constants/vendor/documentPajakTypes';

export const fetchPajakSppkp = (id,parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/vendor/${id}/vendor_sppkp`,{
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentPajakTypes.SUCCESS_FETCH_DOC_SPPKP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentPajakTypes.FAIL_FETCH_DOC_SPPKP, response: error.response })
                });
        })
    }
}

export const savePajakSppkp = (vendor_uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor/' + vendor_uuid + '/vendor_sppkp', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: documentPajakTypes.SUCCESS_SAVE_DOC_SPPKP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: documentPajakTypes.FAIL_SAVE_DOC_SPPKP, response: error.response })
                });
        })
    }
}