import axios from '../../../config/axios';
import * as currenciesType from '../../constants/currenciesType';

export const fetchCurrencies = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('currency', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_CURRENCIES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_CURRENCIES, response: error.response })
                });
        })
    }
}

export const showCurrencies = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('currency/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_SHOW_CURRENCIES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_SHOW_CURRENCIES, response: error.response })
                });
        })
    }
}

export const deleteCurrencies = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('currency/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_DELETE_CURRENCIES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_DELETE_CURRENCIES, response: error.response })
                });
        })
    }
}

export const saveCurrencies = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('currency', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_SAVE_CURRENCIES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.SUCCESS_SAVE_CURRENCIES, response: error.response })
                });
        })
    }
}
export const updateCurrencies = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('currency/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_UPDATE_CURRENCIES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.SUCCESS_UPDATE_CURRENCIES, response: error.response })
                });
        })
    }
}