import axios from '../../../config/axios';
import * as itemCategoryTypes from '../../constants/itemCategoryTypes';

export const fetchItemCategory = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios
                .get('item_category', {params: parameter})
                .then(response => {
                    resolve(response);
                    dispatch(
                        {type: itemCategoryTypes.SUCCESS_FETCH_ITEM_CATEGORY, data: response.data}
                    )
                })
                .catch(error => {
                    reject(error.response);
                    dispatch(
                        {type: itemCategoryTypes.FAIL_FETCH_ITEM_CATEGORY, response: error.response}
                    )
                });
        })
    }
}

export const showItemCategory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios
                .get('item_category/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({type: itemCategoryTypes.SUCCESS_SHOW_ITEM_CATEGORY, data: response.data})
                })
                .catch(error => {
                    reject(error.response);
                    dispatch(
                        {type: itemCategoryTypes.FAIL_SHOW_ITEM_CATEGORY, response: error.response}
                    )
                });
        })
    }
}

export const deleteItemCategory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios
                .delete('item_category/' + id)
                .then(response => {
                    resolve(response);
                    dispatch(
                        {type: itemCategoryTypes.SUCCESS_DELETE_ITEM_CATEGORY, data: response.data}
                    )
                })
                .catch(error => {
                    reject(error.response);
                    dispatch(
                        {type: itemCategoryTypes.FAIL_DELETE_ITEM_CATEGORY, response: error.response}
                    )
                });
        })
    }
}

export const saveItemCategory = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios
                .post('item_category', payload)
                .then(response => {
                    resolve(response);
                    dispatch({type: itemCategoryTypes.SUCCESS_SAVE_ITEM_CATEGORY, data: response.data})
                })
                .catch(error => {
                    reject(error.response);
                    dispatch(
                        {type: itemCategoryTypes.SUCCESS_SAVE_ITEM_CATEGORY, response: error.response}
                    )
                });
        })
    }
}
export const updateItemCategory = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios
                .put('item_category/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch(
                        {type: itemCategoryTypes.SUCCESS_UPDATE_ITEM_CATEGORY, data: response.data}
                    )
                })
                .catch(error => {
                    reject(error.response);
                    dispatch(
                        {type: itemCategoryTypes.SUCCESS_UPDATE_ITEM_CATEGORY, response: error.response}
                    )
                });
        })
    }
}