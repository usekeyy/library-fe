import axios from '../../../config/axios';
import * as actionTypes from '../../constants/tendering/proposalTenderTypes';

export const getProposalTender = (uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/proposal_tender/detail/${uuid}`)
							.then(response => {
									resolve(response);
									dispatch({
											type: actionTypes.SUCCESS_GET_PROPOSAL_TENDER,
											data: response.data
									})
							})
							.catch(error => {
									reject(error.response);
									dispatch({ type: actionTypes.FAIL_GET_PROPOSAL_TENDER, response: error.response })
							});
			})
	}
}

export const updateProposalTender = (uuid, payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.put(`tendering/proposal_tender/${uuid}`, payload)
							.then(response => {
									resolve(response);
									dispatch({
											type: actionTypes.SUCCESS_UPDATE_PROPOSAL_TENDER,
											data: response.data
									})
							})
							.catch(error => {
									reject(error.response);
									dispatch({ type: actionTypes.FAIL_UPDATE_PROPOSAL_TENDER, response: error.response })
							});
			})
	}
}

export const submitProposalTender = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`tendering/proposal_tender`,payload)
							.then(response => {
									resolve(response);
									dispatch({
											type: actionTypes.SUCCESS_SUBMIT_PROPOSAL_TENDER,
											data: response.data
									})
							})
							.catch(error => {
									reject(error.response);
									dispatch({ type: actionTypes.FAIL_SUBMIT_PROPOSAL_TENDER, response: error.response })
							});
			})
	}
}

export const setSelectedItemsPr = response => {
	return dispatch => {
			if(response.type) {
					dispatch({type: actionTypes.SUCCESS_SET_SELECTED_ITEMS_PR, data: response.data});
				} else {
					dispatch({type: actionTypes.FAIL_SET_SELECTED_ITEMS_PR, data: []});
			}
	}
}

export const getDetailEvaluasiMonitoringVendor = (uuid) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.get(`tendering/proposal_tender/detail/evaluasi_admin/${uuid}`)
							.then(response => {
									resolve(response);
									dispatch({
											type: actionTypes.SUCCESS_GET_DETAIL_EVALUASI_MONITORING_VENDOR,
											data: response.data
									})
							})
							.catch(error => {
									reject(error.response);
									dispatch({ type: actionTypes.FAIL_GET_DETAIL_EVALUASI_MONITORING_VENDOR, response: error.response })
							});
			})
	}
}

export const getOA = (parameter) => {
	return dispatch => {
		return new Promise((resolve, reject) => {
			axios.get('tendering/get_list_oa', {
				params: parameter
			})
				.then(response => {
					resolve(response);
					dispatch({
						type: actionTypes.SUCCESS_GET_OA,
						data: response.data
					})
				})
				.catch(error => {
					reject(error.response);
					dispatch({ type: actionTypes.FAIL_GET_OA, response: error.response })
				});
		})
	}
}

export const createPurchaseOrder = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/create_purchase_order', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SUBMIT_OA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SUBMIT_OA, response: error.response })
                });
        })
    }
}

