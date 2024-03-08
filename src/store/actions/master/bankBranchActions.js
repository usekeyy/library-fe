import axios from '../../../config/axios';
import * as currenciesType from '../../constants/bankBranchTypes';

export const fetchBankBranch = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('bank_branch', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_BANK_BRANCH,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_BANK_BRANCH, response: error.response })
                });
        })
    }
}

export const showBankBranch = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('bank_branch/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_SHOW_BANK_BRANCH,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_SHOW_BANK_BRANCH, response: error.response })
                });
        })
    }
}

export const deleteBankBranch = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('bank_branch/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_DELETE_BANK_BRANCH,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_DELETE_BANK_BRANCH, response: error.response })
                });
        })
    }
}

export const saveBankBranch = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('bank_branch', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_SAVE_BANK_BRANCH,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.SUCCESS_SAVE_BANK_BRANCH, response: error.response })
                });
        })
    }
}
export const updateBankBranch = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('bank_branch/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_UPDATE_BANK_BRANCH,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.SUCCESS_UPDATE_BANK_BRANCH, response: error.response })
                });
        })
    }
}