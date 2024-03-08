import axios from '../../../config/axios';
import * as masterKpiTypes from '../../constants/masterKpiTypes';

export const fetchMasterKpi = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/master_kpi', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterKpiTypes.SUCCESS_FETCH_MASTER_KPI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterKpiTypes.FAIL_FETCH_MASTER_KPI, response: error.response })
                });
        })
    }
}

export const showMasterKpi= (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/master_kpi/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterKpiTypes.SUCCESS_GET_MASTER_KPI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterKpiTypes.FAIL_GET_MASTER_KPI, response: error.response })
                });
        })
    }
}

export const saveMasterKpi = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/master_kpi', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterKpiTypes.SUCCESS_STORE_MASTER_KPI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterKpiTypes.FAIL_STORE_MASTER_KPI, response: error.response })
                });
        })
    }
}

export const deleteMasterKpi = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/master_kpi/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterKpiTypes.SUCCESS_DELETE_MASTER_KPI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterKpiTypes.FAIL_DELETE_MASTER_KPI, response: error.response })
                });
        })
    }
}


// export const updateAssets = (id, payload) => {
//     return dispatch => {
//         return new Promise((resolve, reject) => {
//             axios.put('asset/' + id, payload)
//                 .then(response => {
//                     resolve(response);
//                     dispatch({
//                         type: assetsTypes.SUCCESS_UPDATE_ASSETS,
//                         data: response.data
//                     })
//                 })
//                 .catch(error => {
//                     reject(error.response);
//                     dispatch({ type: assetsTypes.SUCCESS_UPDATE_ASSETS, response: error.response })
//                 });
//         })
//     }
// }
// export const syncAssets = (payload) => {
//     return dispatch => {
//         return new Promise((resolve, reject) => {
//             axios.post('sync_asset', payload)
// 						.then(response => {
// 								resolve(response);
// 								dispatch({
// 										type: assetsTypes.SUCCESS_SYNC_ASSETS,
// 										data: response.data
// 								})
// 						})
// 						.catch(error => {
// 								reject(error.response);
// 								dispatch({ type: assetsTypes.FAIL_SYNC_ASSETS, response: error.response })
// 						});
//         })
//     }
// }
