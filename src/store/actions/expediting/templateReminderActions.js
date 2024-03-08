import axios from '../../../config/axios';
import * as templateReminderTypes from '../../constants/expediting/templateReminderTypes';

export const fetchTemplateReminder = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/reminder_template', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templateReminderTypes.SUCCESS_FETCH_TEMPLATE_REMINDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templateReminderTypes.FAIL_FETCH_TEMPLATE_REMINDER, response: error.response })
                });
        })
    }
}

export const showTemplateReminder = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/reminder_template/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templateReminderTypes.SUCCESS_SHOW_TEMPLATE_REMINDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templateReminderTypes.FAIL_SHOW_TEMPLATE_REMINDER, response: error.response })
                });
        })
    }
}

export const deleteTemplateReminder = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('invoice/reminder_template/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templateReminderTypes.SUCCESS_DELETE_TEMPLATE_REMINDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templateReminderTypes.FAIL_DELETE_TEMPLATE_REMINDER, response: error.response })
                });
        })
    }
}

export const saveTemplateReminder = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/reminder_template', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templateReminderTypes.SUCCESS_SAVE_TEMPLATE_REMINDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templateReminderTypes.FAIL_SAVE_TEMPLATE_REMINDER, response: error.response })
                });
        })
    }
}
export const updateTemplateReminder = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/reminder_template/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templateReminderTypes.SUCCESS_UPDATE_TEMPLATE_REMINDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templateReminderTypes.SUCCESS_UPDATE_TEMPLATE_REMINDER, response: error.response })
                });
        })
    }
}
