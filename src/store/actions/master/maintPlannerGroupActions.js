import axios from '../../../config/axios';
import * as actionTypes from '../../constants/maintPlannerGroupTypes';

export const fetchMaintPlannerGroup = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'maint_planner_group';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_MAINT_PLANNER_GROUP,
						data: response.data,
						optionPaginate: payload,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_MAINT_PLANNER_GROUP, response: response })
				});
		})
	}
}


export const saveMaintPlannerGroup = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post('/maint_planner_group', payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SAVE_MAINT_PLANNER_GROUP,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SAVE_MAINT_PLANNER_GROUP, response: response})
					})
			})
	}
}

export const showMaintPlannerGroup = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/maint_planner_group/${id}`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_MAINT_PLANNER_GROUP,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_MAINT_PLANNER_GROUP, response: response})
					})
			})   
	}
}

export const updateMaintPlannerGroup = (payload, id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/maint_planner_group/${id}`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_UPDATE_MAINT_PLANNER_GROUP,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_UPDATE_MAINT_PLANNER_GROUP, response: response})
					})
			})
	}
}

export const deleteMaintPlannerGroup = (id) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.delete(`/maint_planner_group/${id}`)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DELETE_MAINT_PLANNER_GROUP,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DELETE_MAINT_PLANNER_GROUP, response: response})
					})
			})
	}
}