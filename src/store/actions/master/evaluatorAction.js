import axios from '../../../config/axios';
import * as evaluatorType from '../../constants/evaluatorTypes';

export const fetchEvaluator = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/evaluator', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluatorType.SUCCESS_FETCH_EVALUATOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: evaluatorType.FAIL_FETCH_EVALUATOR, response: error.response })
                });
        })
    }
}

export const showEvaluator = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/evaluator/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluatorType.SUCCESS_SHOW_EVALUATOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: evaluatorType.FAIL_SHOW_EVALUATOR, response: error.response })
                });
        })
    }
}

export const deleteEvaluator = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/evaluator/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluatorType.SUCCESS_DELETE_EVALUATOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: evaluatorType.FAIL_DELETE_EVALUATOR, response: error.response })
                });
        })
    }
}

export const saveEvaluator = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/evaluator', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluatorType.SUCCESS_SAVE_EVALUATOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: evaluatorType.FAIL_SAVE_EVALUATOR, response: error.response })
                });
        })
    }
}
export const updateEvaluator = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/evaluator/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluatorType.SUCCESS_UPDATE_EVALUATOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: evaluatorType.FAIL_UPDATE_EVALUATOR, response: error.response })
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
						type: evaluatorType.SUCCESS_FETCH_USERS_EVALUATOR,
						data: response.data,
						status: response.status
					})
				})
				.catch(error => {
					const response = (typeof error.response !== 'object') ? {} : error.response;
					reject(response);
					dispatch({ type: evaluatorType.FAIL_FETCH_USERS_EVALUATOR, response: response })
				});
		})
	}
}
