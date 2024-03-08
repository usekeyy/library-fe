import axios from '../../../config/axios';
import * as actionTypes from '../../constants/materialTypes';

export const fetchMaterial = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material', {
                params: parameter
            })
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_FETCH_MATERIAL,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.FAIL_FETCH_MATERIAL, response: error.response })
						});
        })
    }
}

export const showMaterial = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material/' + id)
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_SHOW_MATERIAL,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.FAIL_SHOW_MATERIAL, response: error.response })
						});
        })
    }
}

export const deleteMaterial = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('material_service/material/' + id)
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_DELETE_MATERIAL,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.FAIL_DELETE_MATERIAL, response: error.response })
						});
        })
    }
}

export const saveMaterial = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_service/material', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_SAVE_MATERIAL,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.SUCCESS_SAVE_MATERIAL, response: error.response })
						});
        })
    }
}
export const updateMaterial = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('material_service/material/' + id, payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_UPDATE_MATERIAL,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.SUCCESS_UPDATE_MATERIAL, response: error.response })
						});
        })
    }
}
export const syncMaterial = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_service/sync_material', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_SYNC_MATERIAL,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.SUCCESS_SYNC_MATERIAL, response: error.response })
						});
        })
    }
}
