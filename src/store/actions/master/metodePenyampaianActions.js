import axios from '../../../config/axios';
import * as metodePenyampaianTypes from '../../constants/metodePenyampaianTypes';

export const fetchMetodePenyampaian = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/metode_penyampaian', {
                params: parameter
            })
						.then(response => {
								resolve(response);
								dispatch({
										type: metodePenyampaianTypes.SUCCESS_FETCH_METODE_PENYAMPAIAN,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodePenyampaianTypes.FAIL_FETCH_METODE_PENYAMPAIAN, response: error.response })
						});
        })
    }
}

export const showMetodePenyampaian = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/metode_penyampaian/' + id)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodePenyampaianTypes.SUCCESS_SHOW_METODE_PENYAMPAIAN,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodePenyampaianTypes.FAIL_SHOW_METODE_PENYAMPAIAN, response: error.response })
						});
        })
    }
}

export const deleteMetodePenyampaian = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/metode_penyampaian/' + id)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodePenyampaianTypes.SUCCESS_DELETE_METODE_PENYAMPAIAN,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodePenyampaianTypes.FAIL_DELETE_METODE_PENYAMPAIAN, response: error.response })
						});
        })
    }
}

export const saveMetodePenyampaian = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/metode_penyampaian', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodePenyampaianTypes.SUCCESS_SAVE_METODE_PENYAMPAIAN,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodePenyampaianTypes.FAIL_SAVE_METODE_PENYAMPAIAN, response: error.response })
						});
        })
    }
}
export const updateMetodePenyampaian = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/metode_penyampaian/' + id, payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodePenyampaianTypes.SUCCESS_UPDATE_METODE_PENYAMPAIAN,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodePenyampaianTypes.FAIL_UPDATE_METODE_PENYAMPAIAN, response: error.response })
						});
        })
    }
}