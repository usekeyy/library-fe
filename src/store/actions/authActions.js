import axios from '../../config/axios';
import * as actionTypes from '../constants/actionTypes';
import * as actionVendor from '../constants/vendor/profileVendorTypes';
import {encrypt} from '../../config/generate';

export const loginAction = (payload) => {
	return dispatch => {
			return axios.post('login', payload)
	}
}

export const praQualificationDetailResponse = response => {
	return dispatch => {
			if(response.type) {
				dispatch({type: actionTypes.SUCCESS_SHOW_PRA_QUALIFICATION_DETAIL, tender_uuid: response.tender_uuid});
			} else {
				dispatch({type: actionTypes.FAIL_SHOW_PRA_QUALIFICATION_DETAIL});
			}
	}
}

export const loginResponse = (response) => {
	return dispatch => {
			if(response.type) {
				console.log(response);
					dispatch({ type: actionTypes.SUCCESS_LOGIN_ACTION, token: response.authorization, data: response.data, access: response.keyAccess });
					localStorage.setItem('access-control', encrypt(response.keyAccess));
					localStorage.setItem('token', response.data.data.token);
					// window.location.reload(true);
			} else {
					dispatch({type: actionTypes.FAIL_LOGIN_ACTION});
			}
	}
}

export const logoutAction = (payload = {}) => {
	return dispatch => {
			return axios.get('logout', payload)
	}
}

export const logoutResponse = response => {
	return dispatch => {
			if(response.type) {
					dispatch({type: actionTypes.SUCCESS_LOGOUT_ACTION});
					dispatch({type: actionVendor.FAIL_FETCH_PROFILE_VENDOR});
				} else {
					dispatch({type: actionTypes.FAIL_LOGOUT_ACTION});
					dispatch({type: actionVendor.FAIL_FETCH_PROFILE_VENDOR});
			}
	}
}

export const forgotPassword = (payload) => {
	return dispatch => {
		return new Promise((resolve, reject) => {
            axios.post('reset_password', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FORGOT_PASSWORD,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FORGOT_PASSWORD, response: error.response })
                });
        })
	}
}

export const authFetch = (payload) => {
	return dispatch => {
		return new Promise((resolve, reject) => {
            axios.get('fetch', payload)
                .then(response => {
                    resolve(response);
										// localStorage.setItem('times' , response.data.data.timestamp)
                    dispatch({
                        type: actionTypes.SUCCESS_AUTH_FETCH,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_AUTH_FETCH, response: error.response })
                });
        })
	}
}

export const modalShowFalse = response => {
	return dispatch => {
			dispatch({type: actionTypes.MODAL_SHOW_FALSE});
	}
}