import axios from '../../../config/axios';
import * as serviceCategoryTypes from '../../constants/serviceCategoryTypes';

export const fetchServiceCategory = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/service_category', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: serviceCategoryTypes.SUCCESS_FETCH_SERVICE_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: serviceCategoryTypes.FAIL_FETCH_SERVICE_CATEGORY, response: error.response })
                });
        })
    }
}

export const showServiceCategory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_service/service_category/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: serviceCategoryTypes.SUCCESS_SHOW_SERVICE_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: serviceCategoryTypes.FAIL_SHOW_SERVICE_CATEGORY, response: error.response })
                });
        })
    }
}

export const deleteServiceCategory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('material_service/service_category/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: serviceCategoryTypes.SUCCESS_DELETE_SERVICE_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: serviceCategoryTypes.FAIL_DELETE_SERVICE_CATEGORY, response: error.response })
                });
        })
    }
}

export const saveServiceCategory = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_service/service_category', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: serviceCategoryTypes.SUCCESS_SAVE_SERVICE_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: serviceCategoryTypes.FAIL_SAVE_SERVICE_CATEGORY, response: error.response })
                });
        })
    }
}
export const updateServiceCategory = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('material_service/service_category/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: serviceCategoryTypes.SUCCESS_UPDATE_SERVICE_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: serviceCategoryTypes.FAIL_UPDATE_SERVICE_CATEGORY, response: error.response })
                });
        })
    }
}