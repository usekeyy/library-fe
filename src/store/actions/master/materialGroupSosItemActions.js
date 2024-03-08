
import axios from '../../../config/axios';
import * as materialGroupSosItemTypes from '../../constants/materialGroupSosItemTypes';

export const fetchMaterialGroupSosItem = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material_group_sos_item', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupSosItemTypes.SUCCESS_FETCH_MATERIAL_GROUP_SOS_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupSosItemTypes.FAIL_FETCH_MATERIAL_GROUP_SOS_ITEM, response: error.response })
                });
        })
    }
}

export const showMaterialGroupSosItem = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material_group_sos_item/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupSosItemTypes.SUCCESS_SHOW_MATERIAL_GROUP_SOS_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupSosItemTypes.FAIL_SHOW_MATERIAL_GROUP_SOS_ITEM, response: error.response })
                });
        })
    }
}

export const deleteMaterialGroupSosItem = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('material_service/material_group_sos_item/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupSosItemTypes.SUCCESS_DELETE_MATERIAL_GROUP_SOS_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupSosItemTypes.FAIL_DELETE_MATERIAL_GROUP_SOS_ITEM, response: error.response })
                });
        })
    }
}

export const saveMaterialGroupSosItem = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_service/material_group_sos_item', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupSosItemTypes.SUCCESS_SAVE_MATERIAL_GROUP_SOS_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupSosItemTypes.FAIL_SAVE_MATERIAL_GROUP_SOS_ITEM, response: error.response })
                });
        })
    }
}
export const updateMaterialGroupSosItem = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('material_service/material_group_sos_item/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialGroupSosItemTypes.SUCCESS_UPDATE_MATERIAL_GROUP_SOS_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialGroupSosItemTypes.FAIL_UPDATE_MATERIAL_GROUP_SOS_ITEM, response: error.response })
                });
        })
    }
}
export const syncMaterialGroupSosItem = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_service/sync_material_group_sos_item', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: materialGroupSosItemTypes.SUCCESS_SYNC_MATERIAL_GROUP_SOS_ITEM,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: materialGroupSosItemTypes.FAIL_SYNC_MATERIAL_GROUP_SOS_ITEM, response: error.response })
						});
        })
    }
}

