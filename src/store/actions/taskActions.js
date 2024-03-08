import axios from '../../config/axios';
// import axios from 'axios';
import * as actionTypes from '../constants/actionTypes';

export const fetchTaskMenu = () => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			axios.get('task/menu')
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_TASK_MENU,
						data: response.data.data,
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_TASK_MENU, response: response })
				});
		})
	}
}

export const fetchTaskItem = (task_id, parameter) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			axios.get(`task/ticket/${task_id}`, {
                params: parameter
            })
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_TASK_TICKET,
						data: response.data.data,
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_TASK_TICKET, response: response })
				});
		})
	}
}

// task delegation

export const fetchUserAssignTask = (parameter) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			axios.get(`task/task_delegation/assign_user`, {
                params: parameter
            })
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_USER_ASSIGN_TASK,
						data: response.data.data,
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_USER_ASSIGN_TASK, response: response })
				});
		})
	}
}

export const fetchAssignTask = (parameter) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			axios.get(`task/task_delegation/assign_task`, {
                params: parameter
            })
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_ASSIGN_TASK_DELEGATION,
						data: response.data.data,
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_ASSIGN_TASK_DELEGATION, response: response })
				});
		})
	}
}

export const saveAssignTaskDelegation = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('task/task_delegation/assign_task_to', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_ASSIGN_TASK_DELEGATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SAVE_ASSIGN_TASK_DELEGATION, response: error.response })
                });
        })
    }
}