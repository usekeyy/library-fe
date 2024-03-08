import axios from '../../../config/axios';
import * as actionTypes from '../../constants/tendering/vendorRegistrationTenderTypes';

export const saveVendorRegistrationTender = (uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`tendering/registration_proposal_tender/${uuid}`, payload)
            .then(response => {
                resolve(response);
                dispatch({
                    type: actionTypes.SUCCESS_SAVE_VENDOR_REGISTRATION_TENDER,
                    data: response.data
                })
            })
            .catch(error => {
                reject(error.response);
                dispatch({ type: actionTypes.FAIL_SAVE_VENDOR_REGISTRATION_TENDER, response: error.response })
            });
        })
    }
}