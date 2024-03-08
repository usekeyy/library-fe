import axios from '../../../config/axios';
import * as subDistrictsTypes from '../../constants/subDistrictsTypes';

export const fetchSubDistricts = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('sub_district', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: subDistrictsTypes.SUCCESS_FETCH_SUB_DISTRICT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: subDistrictsTypes.FAIL_FETCH_SUB_DISTRICT, response: error.response })
                });
        })
    }
}

export const showSubDistricts = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('sub_district/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: subDistrictsTypes.SUCCESS_SHOW_SUB_DISTRICT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: subDistrictsTypes.FAIL_SHOW_SUB_DISTRICT, response: error.response })
                });
        })
    }
}

export const deleteSubDistricts = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('sub_district/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: subDistrictsTypes.SUCCESS_DELETE_SUB_DISTRICT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: subDistrictsTypes.FAIL_DELETE_SUB_DISTRICT, response: error.response })
                });
        })
    }
}

export const saveSubDistricts = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sub_district', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: subDistrictsTypes.SUCCESS_SAVE_SUB_DISTRICT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: subDistrictsTypes.FAIL_SAVE_SUB_DISTRICT, response: error.response })
                });
        })
    }
}
export const updateSubDistricts = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('sub_district/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: subDistrictsTypes.SUCCESS_UPDATE_SUB_DISTRICT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: subDistrictsTypes.SUCCESS_UPDATE_SUB_DISTRICT, response: error.response })
                });
        })
    }
}