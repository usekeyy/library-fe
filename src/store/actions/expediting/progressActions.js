import axios from '../../../config/axios';
import * as progressTypes from '../../constants/expediting/progressTypes';

export const fetchProgress = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/expediting_progress', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: progressTypes.SUCCESS_FETCH_PROGRESS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: progressTypes.FAIL_FETCH_PROGRESS, response: error.response })
                });
        })
    }
}

export const showProgress = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/expediting_progress/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: progressTypes.SUCCESS_SHOW_PROGRESS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: progressTypes.FAIL_SHOW_PROGRESS, response: error.response })
                });
        })
    }
}

export const deleteProgress = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('invoice/expediting_progress/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: progressTypes.SUCCESS_DELETE_PROGRESS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: progressTypes.FAIL_DELETE_PROGRESS, response: error.response })
                });
        })
    }
}

export const saveProgress = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/expediting_progress', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: progressTypes.SUCCESS_SAVE_PROGRESS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: progressTypes.FAIL_SAVE_PROGRESS, response: error.response })
                });
        })
    }
}
export const updateProgress = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/expediting_progress/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: progressTypes.SUCCESS_UPDATE_PROGRESS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: progressTypes.SUCCESS_UPDATE_PROGRESS, response: error.response })
                });
        })
    }
}

export const showProgressLog = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/expediting_progress_log/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: progressTypes.SUCCESS_FETCH_PROGRESS_LOG,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: progressTypes.FAIL_FETCH_PROGRESS_LOG, response: error.response })
                });
        })
    }
}

