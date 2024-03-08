import axios from '../../../config/axios';
import * as materialServiceTypes from '../../constants/materialServiceTypes';

export const fetchMaterialServiceMaterial= (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/material', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialServiceTypes.SUCCESS_FETCH_ITEM_MATERIAL_SERVICE_MATERIAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialServiceTypes.FAIL_FETCH_ITEM_MATERIAL_SERVICE_MATERIAL, response: error.response })
                });
        })
    }
}

// export const showItemCategory = (id) => {
//     return dispatch => {
//         return new Promise((resolve, reject) => {
//             axios.get('item_category/' + id)
//                 .then(response => {
//                     resolve(response);
//                     dispatch({
//                         type: itemCategoryTypes.SUCCESS_SHOW_GENERAL_PLANNER,
//                         data: response.data
//                     })
//                 })
//                 .catch(error => {
//                     reject(error.response);
//                     dispatch({ type: itemCategoryTypes.FAIL_SHOW_GENERAL_PLANNER, response: error.response })
//                 });
//         })
//     }
// }

// export const deleteItemCategory = (id) => {
//     return dispatch => {
//         return new Promise((resolve, reject) => {
//             axios.delete('item_category/' + id)
//                 .then(response => {
//                     resolve(response);
//                     dispatch({
//                         type: itemCategoryTypes.SUCCESS_DELETE_GENERAL_PLANNER,
//                         data: response.data
//                     })
//                 })
//                 .catch(error => {
//                     reject(error.response);
//                     dispatch({ type: itemCategoryTypes.FAIL_DELETE_GENERAL_PLANNER, response: error.response })
//                 });
//         })
//     }
// }

// export const saveItemCategory = (payload) => {
//     return dispatch => {
//         return new Promise((resolve, reject) => {
//             axios.post('item_category', payload)
//                 .then(response => {
//                     resolve(response);
//                     dispatch({
//                         type: itemCategoryTypes.SUCCESS_SAVE_GENERAL_PLANNER,
//                         data: response.data
//                     })
//                 })
//                 .catch(error => {
//                     reject(error.response);
//                     dispatch({ type: itemCategoryTypes.FAIL_SAVE_GENERAL_PLANNER, response: error.response })
//                 });
//         })
//     }
// }
// export const updateItemCategory = (id, payload) => {
//     return dispatch => {
//         return new Promise((resolve, reject) => {
//             axios.put('item_category/' + id, payload)
//                 .then(response => {
//                     resolve(response);
//                     dispatch({
//                         type: itemCategoryTypes.SUCCESS_UPDATE_GENERAL_PLANNER,
//                         data: response.data
//                     })
//                 })
//                 .catch(error => {
//                     reject(error.response);
//                     dispatch({ type: itemCategoryTypes.FAIL_UPDATE_GENERAL_PLANNER, response: error.response })
//                 });
//         })
//     }
// }