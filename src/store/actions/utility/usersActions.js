import axios from '../../../config/axios';
import * as actionTypes from '../../constants/actionTypes';

export const fetchUsers = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'user';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_USERS,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_USERS, response: response })
				});
		})
	}
}


export const saveUsers = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/user', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_USERS,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_USERS, response: response})
					})
			})
	}
}

export const showUsers = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/user/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_USERS,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_USERS, response: response})
					})
			})   
	}
}

export const updateUsers = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/user/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_USERS,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_USERS, response: response})
					})
			})
	}
}

export const deleteUsers = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/user/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_USERS,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_USERS, response: response})
					})
			})
	}
}

export const saveUsersRole = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					let url = 'user/'+id+'/role';
					axios.post(url, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_USERS_ROLE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_USERS_ROLE, response: response})
					})
			})
	}
}

export const changePassword = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/user/${id}/password`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_CHANGE_PASSWORD,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_CHANGE_PASSWORD, response: response})
					})
			})
	}
}

export const changePasswordByAdmin = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/user/${id}/reset_password`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_CHANGE_PASSWORD_BY_ADMIN,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_CHANGE_PASSWORD_BY_ADMIN, response: response})
					})
			})
	}
}