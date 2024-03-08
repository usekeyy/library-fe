import axios from '../../../config/axios';
import * as expeditingTypes from '../../constants/expediting/expeditingTypes';

export const fetchExpediting = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/expediting', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: expeditingTypes.SUCCESS_FETCH_EXPEDITING,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: expeditingTypes.FAIL_FETCH_EXPEDITING, response: error.response })
                });
        })
    }
}

export const showExpediting = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/expediting/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: expeditingTypes.SUCCESS_SHOW_EXPEDITING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: expeditingTypes.FAIL_SHOW_EXPEDITING, response: error.response })
                });
        })
    }
}

