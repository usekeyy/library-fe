import axios from '../../../config/axios';
import * as costCenterTypes from '../../constants/costCenterTypes';

export const fetchCostCenter = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('cost_center', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: costCenterTypes.SUCCESS_FETCH_COST_CENTER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: costCenterTypes.FAIL_FETCH_COST_CENTER, response: error.response })
                });
        })
    }
}

export const showCostCenter = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('cost_center/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: costCenterTypes.SUCCESS_SHOW_COST_CENTER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: costCenterTypes.FAIL_SHOW_COST_CENTER, response: error.response })
                });
        })
    }
}

export const deleteCostCenter = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('cost_center/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: costCenterTypes.SUCCESS_DELETE_COST_CENTER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: costCenterTypes.FAIL_DELETE_COST_CENTER, response: error.response })
                });
        })
    }
}

export const saveCostCenter = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('cost_center', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: costCenterTypes.SUCCESS_SAVE_COST_CENTER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: costCenterTypes.FAIL_SAVE_COST_CENTER, response: error.response })
                });
        })
    }
}
export const updateCostCenter = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('cost_center/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: costCenterTypes.SUCCESS_UPDATE_COST_CENTER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: costCenterTypes.SUCCESS_UPDATE_COST_CENTER, response: error.response })
                });
        })
    }
}
export const syncCostCenter = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_cost_center', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: costCenterTypes.SUCCESS_SYNC_COST_CENTER,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: costCenterTypes.FAIL_SYNC_COST_CENTER, response: error.response })
						});
        })
    }
}
