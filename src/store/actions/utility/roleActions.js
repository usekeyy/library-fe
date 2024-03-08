import axios from '../../../config/axios';
import * as actionTypes from '../../constants/actionTypes';

export const fetchRole = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'role';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_ROLE,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_ROLE, response: response })
				});
		})
	}
}


export const saveRole = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/role', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_ROLE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_ROLE, response: response})
					})
			})
	}
}

export const showRole = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/role/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_ROLE,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_ROLE, response: response})
					})
			})   
	}
}

export const updateRole = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/role/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_ROLE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_ROLE, response: response})
					})
			})
	}
}

export const deleteRole = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/role/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_ROLE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_ROLE, response: response})
					})
			})
	}
}

export const fetchRolePermissions = (id) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			let url = 'role/'+id+'/permission';
			axios.get(url)
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_ROLE_PERMISSIONS,
						data: response.data,
					})
				})
				.catch(error => {
					console.log(error.response);
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_ROLE_PERMISSIONS, response: response })
				});
		})
	}
}

export const saveRolePermissions = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					let url = 'role/'+id+'/permission';
					axios.post(url, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_ROLE_PERMISSIONS,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_ROLE_PERMISSIONS, response: response})
					})
			})
	}
}

export const saveUserRole = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					let url = 'role/'+id+'/user';
					axios.post(url, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_USER_ROLE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_USER_ROLE, response: response})
					})
			})
	}
}

export const deleteUserRole = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					let url = 'role/'+id+'/user';
					axios.delete(url, {
						params: payload
					})
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_USER_ROLE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_USER_ROLE, response: response})
					})
			})
	}
}