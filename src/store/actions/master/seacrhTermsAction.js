import axios from '../../../config/axios';
import * as actionTypes from '../../constants/seacrhTermsTypes';

export const fetchSearchTerms = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            console.log(parameter)
            axios.get('vendor_management/searchterms', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_SEARCHTERMS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_SEARCHTERMS, response: error.response })
                });
        })
    }
}

export const showSearchTerms = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/searchterms/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SHOW_SEARCHTERMS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SHOW_SEARCHTERMS, response: error.response })
                });
        })
    }
}

export const deleteSearchTerms = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/searchterms/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_SEARCHTERMS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_SEARCHTERMS, response: error.response })
                });
        })
    }
}

export const saveSearchTerms = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/searchterms', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_SEARCHTERMS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_SAVE_SEARCHTERMS, response: error.response })
                });
        })
    }
}
export const updateSearchTerms = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/searchterms/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_SEARCHTERMS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_UPDATE_SEARCHTERMS, response: error.response })
                });
        })
    }
}