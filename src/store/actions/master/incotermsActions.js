import axios from '../../../config/axios';
import * as incotermsType from '../../constants/incotermsType';

export const fetchIncoterms = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('incoterm', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: incotermsType.SUCCESS_FETCH_INCOTERMS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: incotermsType.FAIL_FETCH_INCOTERMS, response: error.response })
                });
        })
    }
}

export const showIncoterms = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('incoterm/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: incotermsType.SUCCESS_SHOW_INCOTERMS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: incotermsType.FAIL_SHOW_INCOTERMS, response: error.response })
                });
        })
    }
}

export const deleteIncoterms = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('incoterm/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: incotermsType.SUCCESS_DELETE_INCOTERMS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: incotermsType.FAIL_DELETE_INCOTERMS, response: error.response })
                });
        })
    }
}

export const saveIncoterms = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('incoterm', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: incotermsType.SUCCESS_SAVE_INCOTERMS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: incotermsType.FAIL_SAVE_INCOTERMS, response: error.response })
                });
        })
    }
}
export const updateIncoterms = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('incoterm/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: incotermsType.SUCCESS_UPDATE_INCOTERMS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: incotermsType.SUCCESS_UPDATE_INCOTERMS, response: error.response })
                });
        })
    }
}