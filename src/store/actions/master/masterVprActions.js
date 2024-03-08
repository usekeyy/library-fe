import axios from '../../../config/axios';
import * as masterVprTypes from '../../constants/masterVprTypes';

export const fetchMasterVpr = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/vendor_management/master_vpr', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterVprTypes.SUCCESS_FETCH_MASTER_VPR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterVprTypes.FAIL_FETCH_MASTER_VPR, response: error.response })
                });
        })
    }
}

export const syncMasterVpr = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/sync_master_vpr', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterVprTypes.SUCCESS_SYNC_MASTER_VPR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterVprTypes.FAIL_SYNC_MASTER_VPR, response: error.response })
                });
        })
    }
}

