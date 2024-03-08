import axios from '../../../config/axios';
import * as unbilledTypes from '../../constants/invoice/unbilledTypes';

export const fetchUnbilled = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/unbilled', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: unbilledTypes.SUCCESS_FETCH_UNBILLED,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: unbilledTypes.FAIL_FETCH_UNBILLED, response: error.response })
                });
        })
    }
}

export const showUnbilled = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/unbilled/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: unbilledTypes.SUCCESS_SHOW_UNBILLED,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: unbilledTypes.FAIL_SHOW_UNBILLED, response: error.response })
                });
        })
    }
}

export const fetchServiceLine = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/unbilled_service_line', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: unbilledTypes.SUCCESS_FETCH_SERVICE_LINE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: unbilledTypes.FAIL_FETCH_SERVICE_LINE, response: error.response })
                });
        })
    }
}
