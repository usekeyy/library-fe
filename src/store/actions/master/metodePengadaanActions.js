import axios from '../../../config/axios';
import * as metodePengadaanTypes from '../../constants/metodePengadaanTypes';

export const fetchMetodePengadaan = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/metode_pengadaan', {
                params: parameter
            })
						.then(response => {
								resolve(response);
								dispatch({
										type: metodePengadaanTypes.SUCCESS_FETCH_METODE_PENGADAAN,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodePengadaanTypes.FAIL_FETCH_METODE_PENGADAAN, response: error.response })
						});
        })
    }
}

export const showMetodePengadaan = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/metode_pengadaan/' + id)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodePengadaanTypes.SUCCESS_SHOW_METODE_PENGADAAN,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodePengadaanTypes.FAIL_SHOW_METODE_PENGADAAN, response: error.response })
						});
        })
    }
}

export const deleteMetodePengadaan = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/metode_pengadaan/' + id)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodePengadaanTypes.SUCCESS_DELETE_METODE_PENGADAAN,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodePengadaanTypes.FAIL_DELETE_METODE_PENGADAAN, response: error.response })
						});
        })
    }
}

export const saveMetodePengadaan = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/metode_pengadaan', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodePengadaanTypes.SUCCESS_SAVE_METODE_PENGADAAN,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodePengadaanTypes.FAIL_SAVE_METODE_PENGADAAN, response: error.response })
						});
        })
    }
}
export const updateMetodePengadaan = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/metode_pengadaan/' + id, payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodePengadaanTypes.SUCCESS_UPDATE_METODE_PENGADAAN,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodePengadaanTypes.FAIL_UPDATE_METODE_PENGADAAN, response: error.response })
						});
        })
    }
}