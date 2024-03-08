import axios from "../../../../config/axios";
import * as dashboardTypes from '../../../constants/dashboard/dashboardTypes';

export const fetchDetailSummary = (id,parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/summary_auction/'+id, {
                params: parameter 
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_DETAIL_SUMMARY_E_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_GET_DETAIL_SUMMARY_E_AUCTION, response: error.response })
                });
        })
    }
}
