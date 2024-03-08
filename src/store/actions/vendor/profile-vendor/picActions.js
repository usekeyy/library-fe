import axios from '../../../../config/axios';
import * as actionTypes from '../../../constants/vendor/picTypes';

export const showPIC = (vendor_uuid, parameter) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`/vendor_management/vendor/${vendor_uuid}/pic`,{
						params: parameter
					})
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_PIC,
									data: response.data,
									response: response,
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_PIC, response: response})
					})
			})   
	}
}

export const showPICDetail = (pic_uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`vendor_management/vendor/${pic_uuid}/detail_pic`)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_SHOW_DETAIL_PIC,
									data: response.data,
									response: response,
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_SHOW_DETAIL_PIC, response: response})
					})
			})   
	}
}

export const createPIC = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`/vendor_management/vendor/pic`, payload)
					.then(res => {
							resolve(res);
							const response = res.data;
							dispatch({
									type: actionTypes.SUCCESS_CREATE_PIC,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: actionTypes.FAIL_CREATE_PIC, response: response})
					})
			})
	}
}

export const deletePIC = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete(`/vendor_management/vendor/${uuid}/pic`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_PIC,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_PIC, response: error.response })
                });
        })
    }
}

export const updatePIC = (pic_uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor/' + pic_uuid + '/pic', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_PIC,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_PIC, response: error.response })
                });
        })
    }
}
