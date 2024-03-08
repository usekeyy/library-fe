import axios from '../../../config/axios';
import * as villagesTypes from '../../constants/villagesTypes';

export const fetchVillages = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('villages', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: villagesTypes.SUCCESS_FETCH_VILLAGES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: villagesTypes.FAIL_FETCH_VILLAGES, response: error.response })
                });
        })
    }
}

export const showVillages = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('villages/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: villagesTypes.SUCCESS_SHOW_VILLAGES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: villagesTypes.FAIL_SHOW_VILLAGES, response: error.response })
                });
        })
    }
}

export const deleteVillages = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('villages/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: villagesTypes.SUCCESS_DELETE_VILLAGES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: villagesTypes.FAIL_DELETE_VILLAGES, response: error.response })
                });
        })
    }
}

export const saveVillages = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('villages', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: villagesTypes.SUCCESS_SAVE_VILLAGES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: villagesTypes.FAIL_SAVE_VILLAGES, response: error.response })
                });
        })
    }
}
export const updateVillages = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('villages/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: villagesTypes.SUCCESS_UPDATE_VILLAGES,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: villagesTypes.SUCCESS_UPDATE_VILLAGES, response: error.response })
                });
        })
    }
}