import axios from '../../../config/axios';
import * as materialGroupTypes from '../../constants/materialGroupTypes';

export const fetchMaterialGroup = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material_group', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupTypes.SUCCESS_FETCH_MATERIAL_GROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupTypes.FAIL_FETCH_MATERIAL_GROUP, response: error.response })
                });
        })
    }
}

export const showMaterialGroup = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material_group/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupTypes.SUCCESS_SHOW_MATERIAL_GROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupTypes.FAIL_SHOW_MATERIAL_GROUP, response: error.response })
                });
        })
    }
}

export const deleteMaterialGroup = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('material_service/material_group/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupTypes.SUCCESS_DELETE_MATERIAL_GROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupTypes.FAIL_DELETE_MATERIAL_GROUP, response: error.response })
                });
        })
    }
}

export const saveMaterialGroup = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_service/material_group', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupTypes.SUCCESS_SAVE_MATERIAL_GROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupTypes.FAIL_SAVE_MATERIAL_GROUP, response: error.response })
                });
        })
    }
}
export const updateMaterialGroup = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('material_service/material_group/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupTypes.SUCCESS_UPDATE_MATERIAL_GROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupTypes.FAIL_UPDATE_MATERIAL_GROUP, response: error.response })
                });
        })
    }
}