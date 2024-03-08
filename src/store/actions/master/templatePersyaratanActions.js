import axios from '../../../config/axios';
import * as templatePersyaratanTypes from '../../constants/templatePersyaratanTypes';

export const fetchTemplatePersyaratan = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/template_persyaratan', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanTypes.SUCCESS_FETCH_TEMPLATE_PERSYARATAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanTypes.FAIL_FETCH_TEMPLATE_PERSYARATAN, response: error.response })
                });
        })
    }
}

export const fetchTemplatePersyaratanItem = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/template_persyaratan_item', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanTypes.SUCCESS_FETCH_TEMPLATE_PERSYARATAN_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanTypes.FAIL_FETCH_TEMPLATE_PERSYARATAN_ITEM, response: error.response })
                });
        })
    }
}

export const showTemplatePersyaratan = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/template_persyaratan/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanTypes.SUCCESS_SHOW_TEMPLATE_PERSYARATAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanTypes.FAIL_SHOW_TEMPLATE_PERSYARATAN, response: error.response })
                });
        })
    }
}

export const deleteTemplatePersyaratan = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/template_persyaratan/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanTypes.SUCCESS_DELETE_TEMPLATE_PERSYARATAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanTypes.FAIL_DELETE_TEMPLATE_PERSYARATAN, response: error.response })
                });
        })
    }
}

export const saveTemplatePersyaratan = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/template_persyaratan', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanTypes.SUCCESS_SAVE_TEMPLATE_PERSYARATAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanTypes.FAIL_SAVE_TEMPLATE_PERSYARATAN, response: error.response })
                });
        })
    }
}
export const updateTemplatePersyaratan = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/template_persyaratan/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: templatePersyaratanTypes.SUCCESS_UPDATE_TEMPLATE_PERSYARATAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: templatePersyaratanTypes.SUCCESS_UPDATE_TEMPLATE_PERSYARATAN, response: error.response })
                });
        })
    }
}