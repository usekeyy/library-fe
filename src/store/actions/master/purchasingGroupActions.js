import axios from '../../../config/axios';
import * as purchasingGroupTypes from '../../constants/purchasingGroupTypes';

export const fetchPurchasingGroup = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('purchasing_group', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchasingGroupTypes.SUCCESS_FETCH_PURCHASINGGROUP,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: purchasingGroupTypes.FAIL_FETCH_PURCHASINGGROUP, response: error.response })
                });
        })
    }
}

export const showPurchasingGroup = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('purchasing_group/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchasingGroupTypes.SUCCESS_SHOW_PURCHASINGGROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchasingGroupTypes.FAIL_SHOW_PURCHASINGGROUP, response: error.response })
                });
        })
    }
}

export const deletePurchasingGroup = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('purchasing_group/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchasingGroupTypes.SUCCESS_DELETE_PURCHASINGGROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchasingGroupTypes.FAIL_DELETE_PURCHASINGGROUP, response: error.response })
                });
        })
    }
}

export const savePurchasingGroup = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('purchasing_group', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchasingGroupTypes.SUCCESS_SAVE_PURCHASINGGROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchasingGroupTypes.FAIL_SAVE_PURCHASINGGROUP, response: error.response })
                });
        })
    }
}
export const updatePurchasingGroup = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('purchasing_group/' + id,payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchasingGroupTypes.SUCCESS_UPDATE_PURCHASINGGROUP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchasingGroupTypes.FAIL_UPDATE_PURCHASINGGROUP, response: error.response })
                });
        })
    }
}