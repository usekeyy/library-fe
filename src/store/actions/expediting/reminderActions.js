import axios from '../../../config/axios';
import * as reminderTypes from '../../constants/expediting/reminderTypes';

export const fetchReminder = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/reminder', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: reminderTypes.SUCCESS_FETCH_REMINDER,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: reminderTypes.FAIL_FETCH_REMINDER, response: error.response })
                });
        })
    }
}

export const showReminder = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/reminder/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: reminderTypes.SUCCESS_SHOW_REMINDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: reminderTypes.FAIL_SHOW_REMINDER, response: error.response })
                });
        })
    }
}

export const deleteReminder = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('invoice/reminder/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: reminderTypes.SUCCESS_DELETE_REMINDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: reminderTypes.FAIL_DELETE_REMINDER, response: error.response })
                });
        })
    }
}

export const saveReminder = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/reminder', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: reminderTypes.SUCCESS_SAVE_REMINDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: reminderTypes.FAIL_SAVE_REMINDER, response: error.response })
                });
        })
    }
}
export const updateReminder = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/reminder/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: reminderTypes.SUCCESS_UPDATE_REMINDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: reminderTypes.SUCCESS_UPDATE_REMINDER, response: error.response })
                });
        })
    }
}

export const showLogEmailReminder = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/reminder_mail_log', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: reminderTypes.SUCCESS_SHOW_LOG_EMAIL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: reminderTypes.FAIL_SHOW_LOG_EMAIL, response: error.response })
                });
        })
    }
}