import axios from '../../../config/axios';
import * as actionTypes from '../../constants/invoiceProfitCenterTypes';

export const fetchProfitCenter = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/profit_center', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_PROFIT_CENTER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_PROFIT_CENTER, response: error.response })
                });
        })
    }
}

export const syncProfitCenter = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/sync_profit_center')
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SYNC_PROFIT_CENTER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SYNC_PROFIT_CENTER, response: error.response })
                });
        })
    }
}

// export const showNPWP = (id) => {
//     return dispatch => {
//         return new Promise((resolve, reject) => {
//             axios.get('reference_key/' + id)
//                 .then(response => {
//                     resolve(response);
//                     dispatch({
//                         type: actionTypes.SUCCESS_SHOW_NPWP,
//                         data: response.data
//                     })
//                 })
//                 .catch(error => {
//                     reject(error.response);
//                     dispatch({ type: actionTypes.FAIL_SHOW_NPWP, response: error.response })
//                 });
//         })
//     }
// }

// export const deleteNPWP = (id) => {
//     return dispatch => {
//         return new Promise((resolve, reject) => {
//             axios.delete('reference_key/' + id)
//                 .then(response => {
//                     resolve(response);
//                     dispatch({
//                         type: actionTypes.SUCCESS_DELETE_NPWP,
//                         data: response.data
//                     })
//                 })
//                 .catch(error => {
//                     reject(error.response);
//                     dispatch({ type: actionTypes.FAIL_DELETE_NPWP, response: error.response })
//                 });
//         })
//     }
// }

// export const saveNPWP = (payload) => {
//     return dispatch => {
//         return new Promise((resolve, reject) => {
//             axios.post('reference_key', payload)
//                 .then(response => {
//                     resolve(response);
//                     dispatch({
//                         type: actionTypes.SUCCESS_SAVE_NPWP,
//                         data: response.data
//                     })
//                 })
//                 .catch(error => {
//                     reject(error.response);
//                     dispatch({ type: actionTypes.SUCCESS_SAVE_NPWP, response: error.response })
//                 });
//         })
//     }
// }
// export const updateNPWP = (payload, id) => {
//     return dispatch => {
//         return new Promise((resolve, reject) => {
//             axios.put('reference_key/' + id, payload)
//                 .then(response => {
//                     resolve(response);
//                     dispatch({
//                         type: actionTypes.SUCCESS_UPDATE_NPWP,
//                         data: response.data
//                     })
//                 })
//                 .catch(error => {
//                     reject(error.response);
//                     dispatch({ type: actionTypes.SUCCESS_UPDATE_NPWP, response: error.response })
//                 });
//         })
//     }
// }

