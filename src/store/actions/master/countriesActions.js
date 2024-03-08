import axios from '../../../config/axios';
import * as countriesType from '../../constants/countriesType';

export const fetchCountries = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('country', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: countriesType.SUCCESS_FETCH_COUNTRIES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: countriesType.FAIL_FETCH_COUNTRIES, response: error.response })
                });
        })
    }
}

export const showCountries = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('country/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: countriesType.SUCCESS_SHOW_COUNTRIES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: countriesType.FAIL_SHOW_COUNTRIES, response: error.response })
                });
        })
    }
}

export const deleteCountries = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('country/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: countriesType.SUCCESS_DELETE_COUNTRIES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: countriesType.FAIL_DELETE_COUNTRIES, response: error.response })
                });
        })
    }
}

export const saveCountries = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('country', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: countriesType.SUCCESS_SAVE_COUNTRIES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: countriesType.FAIL_SAVE_COUNTRIES, response: error.response })
                });
        })
    }
}
export const updateCountries = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('country/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: countriesType.SUCCESS_UPDATE_COUNTRIES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: countriesType.FAIL_UPDATE_COUNTRIES, response: error.response })
                });
        })
    }
}