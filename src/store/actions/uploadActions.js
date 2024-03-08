import axios from '../../config/axios';
// import axios from 'axios';
import * as actionTypes from '../constants/uploadTypes';

export const guestUpload = (id, payload) => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			formData.append('file', payload);
			axios.post('guest_upload/' + id, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_GUEST_UPLOAD,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_GUEST_UPLOAD, response: response })
				});
		})
	}
}

export const fileUpload = (id, payload) => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			formData.append('file', payload);
			axios.post('upload/' + id, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_UPLOAD_FILE,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_UPLOAD_FILE, response: response })
				});
		})
	}
}

export const uploadMigrasi = (payload) => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			let formData = new FormData();
			formData.append('file', payload);
			axios.post('vendor_management/import_vendor', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_UPLOAD_FILE_MIGRASI,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_UPLOAD_FILE_MIGRASI, response: response })
				});
		})
	}
}

export const mergeDocument = (payload) => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			axios.post('/utils/merge_pdf', payload, {responseType: 'blob'})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_MERGE_DOCUMENT,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_MERGE_DOCUMENT, response: response })
				});
		})
	}
}