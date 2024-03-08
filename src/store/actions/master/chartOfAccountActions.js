import axios from '../../../config/axios';
import * as chartOfAccountTypes from '../../constants/chartOfAccountTypes';

export const fetchChartOfAccount = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('chart_of_account', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: chartOfAccountTypes.SUCCESS_FETCH_CHART_OF_ACCOUNT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: chartOfAccountTypes.FAIL_FETCH_CHART_OF_ACCOUNT, response: error.response })
                });
        })
    }
}

export const showChartOfAccount = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('chart_of_account/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: chartOfAccountTypes.SUCCESS_SHOW_CHART_OF_ACCOUNT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: chartOfAccountTypes.FAIL_SHOW_CHART_OF_ACCOUNT, response: error.response })
                });
        })
    }
}

export const deleteChartOfAccount = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('chart_of_account/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: chartOfAccountTypes.SUCCESS_DELETE_CHART_OF_ACCOUNT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: chartOfAccountTypes.FAIL_DELETE_CHART_OF_ACCOUNT, response: error.response })
                });
        })
    }
}

export const saveChartOfAccount = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('chart_of_account', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: chartOfAccountTypes.SUCCESS_SAVE_CHART_OF_ACCOUNT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: chartOfAccountTypes.FAIL_SAVE_CHART_OF_ACCOUNT, response: error.response })
                });
        })
    }
}
export const updateChartOfAccount = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('chart_of_account/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: chartOfAccountTypes.SUCCESS_UPDATE_CHART_OF_ACCOUNT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: chartOfAccountTypes.FAIL_UPDATE_CHART_OF_ACCOUNT, response: error.response })
                });
        })
    }
}