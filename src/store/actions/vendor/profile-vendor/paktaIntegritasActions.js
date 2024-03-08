import axios from '../../../../config/axios';
import * as actionTypes from '../../../constants/vendor/paktaIntegritasTypes';

export const fetchPaktaIntegritas = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${id}/pakta_integritas`,{
						params: payload
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_FETCH_PAKTA_INTEGRITAS,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_FETCH_PAKTA_INTEGRITAS, response: response})
					})
			})   
	}
}

export const downloadPaktaIntegritas = (uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios({
						url: `vendor_management/vendor/${uuid}/download_pakta_integritas`,
						method: 'GET',
						responseType: 'blob', // important
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_DOWNLOAD_PAKTA_INTEGRITAS,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_DOWNLOAD_PAKTA_INTEGRITAS, response: response})
					})
			})   
	}
}

export const updatePaktaIntegritas = (id, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`/vendor_management/vendor/${id}/pakta_integritas`, payload)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_CREATE_PAKTA_INTEGRITAS,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_CREATE_PAKTA_INTEGRITAS, response: response})
					})
			})   
	}
}
