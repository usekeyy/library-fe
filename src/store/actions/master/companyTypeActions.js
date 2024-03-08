import axios from '../../../config/axios';
import * as actionTypes from '../../constants/companyTypes';

export const fetchCompanyType = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'vendor_management/company_type';
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_FETCH_COMPANY_TYPE,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: actionTypes.FAIL_FETCH_COMPANY_TYPE, response: response })
				});
		})
	}
}