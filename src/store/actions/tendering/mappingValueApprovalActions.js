import axios from '../../../config/axios';
import * as mappingValueApprovalType from '../../constants/tendering/mappingValueApprovalTypes';

export const fetchMappingValueApproval = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/mapping_value_approval', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: mappingValueApprovalType.SUCCESS_FETCH_MAPPING_VALUE_APPROVAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: mappingValueApprovalType.FAIL_FETCH_MAPPING_VALUE_APPROVAL, response: error.response })
                });
        })
    }
}

export const showMappingValueApproval = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/mapping_value_approval/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: mappingValueApprovalType.SUCCESS_SHOW_MAPPING_VALUE_APPROVAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: mappingValueApprovalType.FAIL_SHOW_MAPPING_VALUE_APPROVAL, response: error.response })
                });
        })
    }
}

export const deleteMappingValueApproval = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/mapping_value_approval/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: mappingValueApprovalType.SUCCESS_DELETE_MAPPING_VALUE_APPROVAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: mappingValueApprovalType.FAIL_DELETE_MAPPING_VALUE_APPROVAL, response: error.response })
                });
        })
    }
}

export const saveMappingValueApproval = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/mapping_value_approval', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: mappingValueApprovalType.SUCCESS_SAVE_MAPPING_VALUE_APPROVAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: mappingValueApprovalType.FAIL_SAVE_MAPPING_VALUE_APPROVAL, response: error.response })
                });
        })
    }
}
export const updateMappingValueApproval = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/mapping_value_approval/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: mappingValueApprovalType.SUCCESS_UPDATE_MAPPING_VALUE_APPROVAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: mappingValueApprovalType.FAIL_UPDATE_MAPPING_VALUE_APPROVAL, response: error.response })
                });
        })
    }
}
export const fetchUsersRole = (payload) => {
	return dispatch => {
		return new Promise ((resolve, reject) => {
			const url = 'user_role_purchasing_org';
			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
			axios.get(url, {
				params: payload
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: mappingValueApprovalType.SUCCESS_FETCH_USERS_MAPPING_VALUE_APPROVAL,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: mappingValueApprovalType.FAIL_FETCH_USERS_MAPPING_VALUE_APPROVAL, response: response })
				});
		})
	}
}
