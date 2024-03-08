import axios from '../../../config/axios';
import * as actionTypes from '../../constants/npwpTypes';

export const fetchNPWP = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('reference_key', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_NPWP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_NPWP, response: error.response })
                });
        })
    }
}

export const showNPWP = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('reference_key/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SHOW_NPWP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SHOW_NPWP, response: error.response })
                });
        })
    }
}

export const deleteNPWP = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('reference_key/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_NPWP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_NPWP, response: error.response })
                });
        })
    }
}

export const saveNPWP = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('reference_key', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_NPWP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_SAVE_NPWP, response: error.response })
                });
        })
    }
}
export const updateNPWP = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('reference_key/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_NPWP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_UPDATE_NPWP, response: error.response })
                });
        })
    }
}

export const syncNPWP = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('sync_reference_key')
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SYNC_NPWP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SYNC_NPWP, response: error.response })
                });
        })
    }
}