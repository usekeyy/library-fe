import axios from '../../../config/axios';
import * as serviceTypes from '../../constants/serviceTypes';

export const fetchService = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/service', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: serviceTypes.SUCCESS_FETCH_SERVICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: serviceTypes.FAIL_FETCH_SERVICE, response: error.response })
                });
        })
    }
}

export const showService = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/service/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: serviceTypes.SUCCESS_SHOW_SERVICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: serviceTypes.FAIL_SHOW_SERVICE, response: error.response })
                });
        })
    }
}

export const deleteService = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('material_service/service/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: serviceTypes.SUCCESS_DELETE_SERVICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: serviceTypes.FAIL_DELETE_SERVICE, response: error.response })
                });
        })
    }
}

export const saveService = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_service/service', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: serviceTypes.SUCCESS_SAVE_SERVICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: serviceTypes.FAIL_SAVE_SERVICE, response: error.response })
                });
        })
    }
}
export const updateService = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('material_service/service/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: serviceTypes.SUCCESS_UPDATE_SERVICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: serviceTypes.FAIL_UPDATE_SERVICE, response: error.response })
                });
        })
    }
}