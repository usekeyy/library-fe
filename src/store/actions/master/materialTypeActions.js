import axios from '../../../config/axios';
import * as actionTypes from '../../constants/materialTypeTypes';

export const fetchMaterialType = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material_type/', {
                params: parameter
            })
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_FETCH_MATERIAL_TYPE,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.FAIL_FETCH_MATERIAL_TYPE, response: error.response })
						});
        })
    }
}

export const showMaterialType = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material_type/' + id)
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_SHOW_MATERIAL_TYPE,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.FAIL_SHOW_MATERIAL_TYPE, response: error.response })
						});
        })
    }
}

export const deleteMaterialType = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('material_service/material_type/' + id)
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_DELETE_MATERIAL_TYPE,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.FAIL_DELETE_MATERIAL_TYPE, response: error.response })
						});
        })
    }
}

export const saveMaterialType = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_service/material_type', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_SAVE_MATERIAL_TYPE,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.FAIL_SAVE_MATERIAL_TYPE, response: error.response })
						});
        })
    }
}
export const updateMaterialType = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('material_service/material_type/' + id, payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: actionTypes.SUCCESS_UPDATE_MATERIAL_TYPE,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: actionTypes.FAIL_UPDATE_MATERIAL_TYPE, response: error.response })
						});
        })
    }
}