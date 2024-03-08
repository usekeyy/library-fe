import axios from '../../../config/axios';
import * as buyerType from '../../constants/buyerTypes';

export const fetchBuyer = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('division_buyer', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: buyerType.SUCCESS_FETCH_BUYER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: buyerType.FAIL_FETCH_BUYER, response: error.response })
                });
        })
    }
}

export const showBuyer = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('division_buyer/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: buyerType.SUCCESS_SHOW_BUYER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: buyerType.FAIL_SHOW_BUYER, response: error.response })
                });
        })
    }
}

export const deleteBuyer = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('division_buyer/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: buyerType.SUCCESS_DELETE_BUYER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: buyerType.FAIL_DELETE_BUYER, response: error.response })
                });
        })
    }
}

export const saveBuyer = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('division_buyer', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: buyerType.SUCCESS_SAVE_BUYER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: buyerType.FAIL_SAVE_BUYER, response: error.response })
                });
        })
    }
}
