import axios from '../../../config/axios';
import * as actionTypes from '../../constants/tendering/undanganTenderTypes';

// SUBMIT PR
export const fetchUndanganTender = (vendor_uuid, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/proposal_tender/vendor/${vendor_uuid}`, {
                params: parameter
            })
            .then(response => {
                resolve(response);
                dispatch({
                    type: actionTypes.SUCCESS_FETCH_UNDANGAN_TENDER,
                    data: response.data
                })
            })
            .catch(error => {
                reject(error.response);
                dispatch({ type: actionTypes.FAIL_FETCH_UNDANGAN_TENDER, response: error.response })
            });
        })
    }
}

export const fetchUndanganTenderAktif = (vendor_uuid, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/proposal_tender/tender_aktif/${vendor_uuid}`, {
                params: parameter
            })
            .then(response => {
                resolve(response);
                dispatch({
                    type: actionTypes.SUCCESS_FETCH_UNDANGAN_TENDER_AKTIF,
                    data: response.data
                })
            })
            .catch(error => {
                reject(error.response);
                dispatch({ type: actionTypes.FAIL_FETCH_UNDANGAN_TENDER_AKTIF, response: error.response })
            });
        })
    }
}