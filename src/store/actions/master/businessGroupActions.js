import axios from '../../../config/axios';
import * as businessGroupTypes from '../../constants/businessGroupTypes';

export const fetchBusinessGroup = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/business_group', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: businessGroupTypes.SUCCESS_FETCH_BUSINESS_GROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: businessGroupTypes.FAIL_FETCH_BUSINESS_GROUP, response: error.response })
                });
        })
    }
}

export const showBusinessGroup = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/business_group/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: businessGroupTypes.SUCCESS_SHOW_BUSINESS_GROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: businessGroupTypes.FAIL_SHOW_BUSINESS_GROUP, response: error.response })
                });
        })
    }
}

export const deleteBusinessGroup = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/business_group/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: businessGroupTypes.SUCCESS_DELETE_BUSINESS_GROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: businessGroupTypes.FAIL_DELETE_BUSINESS_GROUP, response: error.response })
                });
        })
    }
}

export const saveBusinessGroup = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/business_group', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: businessGroupTypes.SUCCESS_SAVE_BUSINESS_GROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: businessGroupTypes.FAIL_SAVE_BUSINESS_GROUP, response: error.response })
                });
        })
    }
}
export const updateBusinessGroup = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/business_group/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: businessGroupTypes.SUCCESS_UPDATE_BUSINESS_GROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: businessGroupTypes.SUCCESS_UPDATE_BUSINESS_GROUP, response: error.response })
                });
        })
    }
}