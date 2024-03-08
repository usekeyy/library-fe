import axios from '../../../config/axios';
import * as accAssignmentCategoryTypes from '../../constants/accAssignmentCategoryTypes';

export const fetchAccAssignmentCategory = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('acc_assignment_category', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: accAssignmentCategoryTypes.SUCCESS_FETCH_ACC_ASSGN_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: accAssignmentCategoryTypes.FAIL_FETCH_ACC_ASSGN_CATEGORY, response: error.response })
                });
        })
    }
}

export const showAccAssignmentCategory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('acc_assignment_category/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: accAssignmentCategoryTypes.SUCCESS_SHOW_ACC_ASSGN_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: accAssignmentCategoryTypes.FAIL_SHOW_ACC_ASSGN_CATEGORY, response: error.response })
                });
        })
    }
}

export const deleteAccAssignmentCategory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('acc_assignment_category/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: accAssignmentCategoryTypes.SUCCESS_DELETE_ACC_ASSGN_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: accAssignmentCategoryTypes.FAIL_DELETE_ACC_ASSGN_CATEGORY, response: error.response })
                });
        })
    }
}

export const saveAccAssignmentCategory = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('acc_assignment_category', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: accAssignmentCategoryTypes.SUCCESS_SAVE_ACC_ASSGN_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: accAssignmentCategoryTypes.FAIL_SAVE_ACC_ASSGN_CATEGORY, response: error.response })
                });
        })
    }
}
export const updateAccAssignmentCategory = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('acc_assignment_category/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: accAssignmentCategoryTypes.SUCCESS_UPDATE_ACC_ASSGN_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: accAssignmentCategoryTypes.FAIL_UPDATE_ACC_ASSGN_CATEGORY, response: error.response })
                });
        })
    }
}