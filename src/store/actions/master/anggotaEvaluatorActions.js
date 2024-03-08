import axios from '../../../config/axios';
import * as anggotaEvaluatorType from '../../constants/AnggotaEvaluatorTypes';

export const fetchAnggotaEvaluator = (parameter,uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/anggota_evaluator/' + uuid, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: anggotaEvaluatorType.SUCCESS_FETCH_ANGGOTA_EVALUATOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: anggotaEvaluatorType.FAIL_FETCH_ANGGOTA_EVALUATOR, response: error.response })
                });
        })
    }
}

export const showAnggotaEvaluator = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/show_anggota_evaluator/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: anggotaEvaluatorType.SUCCESS_SHOW_ANGGOTA_EVALUATOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: anggotaEvaluatorType.FAIL_SHOW_ANGGOTA_EVALUATOR, response: error.response })
                });
        })
    }
}

export const deleteAnggotaEvaluator = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/anggota_evaluator/' + id, {data : payload})
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: anggotaEvaluatorType.SUCCESS_DELETE_ANGGOTA_EVALUATOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: anggotaEvaluatorType.FAIL_DELETE_ANGGOTA_EVALUATOR, response: error.response })
                });
        })
    }
}

export const saveAnggotaEvaluator = (payload) => {
    console.log(payload)
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/anggota_evaluator', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: anggotaEvaluatorType.SUCCESS_SAVE_ANGGOTA_EVALUATOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: anggotaEvaluatorType.FAIL_SAVE_ANGGOTA_EVALUATOR, response: error.response })
                });
        })
    }
}
export const updateAnggotaEvaluator = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/anggota_evaluator/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: anggotaEvaluatorType.SUCCESS_UPDATE_ANGGOTA_EVALUATOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: anggotaEvaluatorType.FAIL_UPDATE_ANGGOTA_EVALUATOR, response: error.response })
                });
        })
    }
}

// export const fetchUsersRole = (payload) => {
// 	return dispatch => {
// 		return new Promise ((resolve, reject) => {
// 			const url = 'user_role_purchasing_org';
// 			// let fetchUrl = `${url}/?start=${start}&length=${length}&order[0][column]=${sorted_column}&order[0][dir]=${order}`;
// 			axios.get(url, {
// 				params: payload
// 			})
// 				.then(response => {
// 					resolve(response);
// 					dispatch({
// 						type: anggotaEvaluatorType.SUCCESS_FETCH_USERS_anggotaEvaluator,
// 						data: response.data,
// 						status: response.status
// 					})
// 				})
// 				.catch(error => {
// 					const response = (typeof error.response !== 'object') ? {} : error.response;
// 					reject(response);
// 					dispatch({ type: anggotaEvaluatorType.FAIL_FETCH_USERS_anggotaEvaluator, response: response })
// 				});
// 		})
// 	}
// }
