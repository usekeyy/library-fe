import axios from '../../../config/axios';
import * as districtsType from '../../constants/districtsType';

export const fetchDistricts = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('district', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: districtsType.SUCCESS_FETCH_DISTRICTS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: districtsType.FAIL_FETCH_DISTRICTS, response: error.response })
                });
        })
    }
}

export const showDistricts = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('district/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: districtsType.SUCCESS_SHOW_DISTRICTS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: districtsType.FAIL_SHOW_DISTRICTS, response: error.response })
                });
        })
    }
}

export const deleteDistricts = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('district/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: districtsType.SUCCESS_DELETE_DISTRICTS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: districtsType.FAIL_DELETE_DISTRICTS, response: error.response })
                });
        })
    }
}

export const saveDistricts = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('district', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: districtsType.SUCCESS_SAVE_DISTRICTS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: districtsType.FAIL_SAVE_DISTRICTS, response: error.response })
                });
        })
    }
}
export const updateDistricts = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('district/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: districtsType.SUCCESS_UPDATE_DISTRICTS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: districtsType.SUCCESS_UPDATE_DISTRICTS, response: error.response })
                });
        })
    }
}