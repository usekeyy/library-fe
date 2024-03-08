
import axios from '../../../config/axios';
import * as materialGroupSosHeaderTypes from '../../constants/materialGroupSosHeaderTypes';

export const fetchMaterialGroupSosHeader = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material_group_sos', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupSosHeaderTypes.SUCCESS_FETCH_MATERIAL_GROUP_SOS_HEADER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupSosHeaderTypes.FAIL_FETCH_MATERIAL_GROUP_SOS_HEADER, response: error.response })
                });
        })
    }
}

export const showMaterialGroupSosHeader = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material_group_sos/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupSosHeaderTypes.SUCCESS_SHOW_MATERIAL_GROUP_SOS_HEADER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupSosHeaderTypes.FAIL_SHOW_MATERIAL_GROUP_SOS_HEADER, response: error.response })
                });
        })
    }
}

export const deleteMaterialGroupSosHeader = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('material_service/material_group_sos/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupSosHeaderTypes.SUCCESS_DELETE_MATERIAL_GROUP_SOS_HEADER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupSosHeaderTypes.FAIL_DELETE_MATERIAL_GROUP_SOS_HEADER, response: error.response })
                });
        })
    }
}

export const saveMaterialGroupSosHeader = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_service/material_group_sos', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupSosHeaderTypes.SUCCESS_SAVE_MATERIAL_GROUP_SOS_HEADER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupSosHeaderTypes.FAIL_SAVE_MATERIAL_GROUP_SOS_HEADER, response: error.response })
                });
        })
    }
}
export const updateMaterialGroupSosHeader = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('material_service/material_group_sos/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupSosHeaderTypes.SUCCESS_UPDATE_MATERIAL_GROUP_SOS_HEADER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupSosHeaderTypes.SUCCESS_UPDATE_MATERIAL_GROUP_SOS_HEADER, response: error.response })
                });
        })
    }
}
export const syncMaterialGroupSosHeader = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_service/sync_material_group_sos', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: materialGroupSosHeaderTypes.SUCCESS_SYNC_MATERIAL_GROUP_SOS_HEADER,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: materialGroupSosHeaderTypes.FAIL_SYNC_MATERIAL_GROUP_SOS_HEADER, response: error.response })
						});
        })
    }
}
