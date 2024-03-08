import axios from '../../../config/axios';
import * as userguideTypes from '../../constants/userguideTypes';

export const fetchUserGuide = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'user_guide';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: userguideTypes.SUCCESS_FETCH_USER_GUIDE,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: userguideTypes.FAIL_FETCH_USER_GUIDE, response: response })
				});
		})
	}
}

export const fetchUserGuidePublic = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'user_guide_public';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: userguideTypes.SUCCESS_FETCH_USER_GUIDE_PUBLIC,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: userguideTypes.FAIL_FETCH_USER_GUIDE_PUBLIC, response: response })
				});
		})
	}
}


export const saveUserGuide = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/user_guide', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: userguideTypes.SUCCESS_SAVE_USER_GUIDE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: userguideTypes.FAIL_SAVE_USER_GUIDE, response: response})
					})
			})
	}
}

export const showUserGuide = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/user_guide/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: userguideTypes.SUCCESS_SHOW_USER_GUIDE,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: userguideTypes.FAIL_SHOW_USER_GUIDE, response: response})
					})
			})   
	}
}

export const showUserGuidePublic = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/user_guide_public/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: userguideTypes.SUCCESS_SHOW_USER_GUIDE,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: userguideTypes.FAIL_SHOW_USER_GUIDE, response: response})
					})
			})   
	}
}

export const updateUserGuide = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/user_guide/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: userguideTypes.SUCCESS_UPDATE_USER_GUIDE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: userguideTypes.FAIL_UPDATE_USER_GUIDE, response: response})
					})
			})
	}
}

export const deleteUserGuide = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/user_guide/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: userguideTypes.SUCCESS_DELETE_USER_GUIDE,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: userguideTypes.FAIL_DELETE_USER_GUIDE, response: response})
					})
			})
	}
}