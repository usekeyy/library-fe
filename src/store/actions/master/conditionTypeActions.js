import axios from '../../../config/axios';
import * as conditionTypeType from '../../constants/conditionTypeTypes';

export const fetchConditionType = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('condition_type', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: conditionTypeType.SUCCESS_FETCH_CONDITION_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: conditionTypeType.FAIL_FETCH_CONDITION_TYPE, response: error.response })
                });
        })
    }
}

export const showConditionType = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('condition_type/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: conditionTypeType.SUCCESS_SHOW_CONDITION_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: conditionTypeType.FAIL_SHOW_CONDITION_TYPE, response: error.response })
                });
        })
    }
}

export const deleteConditionType = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('condition_type/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: conditionTypeType.SUCCESS_DELETE_CONDITION_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: conditionTypeType.FAIL_DELETE_CONDITION_TYPE, response: error.response })
                });
        })
    }
}

export const saveConditionType = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('condition_type', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: conditionTypeType.SUCCESS_SAVE_CONDITION_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: conditionTypeType.FAIL_SAVE_CONDITION_TYPE, response: error.response })
                });
        })
    }
}
export const updateConditionType = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('condition_type/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: conditionTypeType.SUCCESS_UPDATE_CONDITION_TYPE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: conditionTypeType.FAIL_UPDATE_CONDITION_TYPE, response: error.response })
                });
        })
    }
}
