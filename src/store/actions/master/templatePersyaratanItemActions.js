import axios from '../../../config/axios';
import * as templatePersyaratanItemTypes from '../../constants/templatePersyaratanItemTypes';

export const fetchTemplatePersyaratanItem = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/template_persyaratan_item', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanItemTypes.SUCCESS_FETCH_TEMPLATE_PERSYARATAN_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanItemTypes.FAIL_FETCH_TEMPLATE_PERSYARATAN_ITEM, response: error.response })
                });
        })
    }
}

export const showTemplatePersyaratanItem = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/template_persyaratan_item/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanItemTypes.SUCCESS_SHOW_TEMPLATE_PERSYARATAN_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanItemTypes.FAIL_SHOW_TEMPLATE_PERSYARATAN_ITEM, response: error.response })
                });
        })
    }
}

export const deleteTemplatePersyaratanItem = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/template_persyaratan_item/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanItemTypes.SUCCESS_DELETE_TEMPLATE_PERSYARATAN_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanItemTypes.FAIL_DELETE_TEMPLATE_PERSYARATAN_ITEM, response: error.response })
                });
        })
    }
}

export const saveTemplatePersyaratanItem = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/template_persyaratan_item', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanItemTypes.SUCCESS_SAVE_TEMPLATE_PERSYARATAN_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanItemTypes.FAIL_SAVE_TEMPLATE_PERSYARATAN_ITEM, response: error.response })
                });
        })
    }
}
export const updateTemplatePersyaratanItem = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/template_persyaratan_item/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanItemTypes.SUCCESS_UPDATE_TEMPLATE_PERSYARATAN_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanItemTypes.SUCCESS_UPDATE_TEMPLATE_PERSYARATAN_ITEM, response: error.response })
                });
        })
    }
}