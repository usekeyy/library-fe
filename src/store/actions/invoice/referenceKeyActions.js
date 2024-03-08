import axios from '../../../config/axios';
import * as referenceKeyTypes from '../../constants/invoice/referenceKeyTypes';

export const fetchReferenceKey = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('reference_key', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: referenceKeyTypes.SUCCESS_FETCH_REFERENCE_KEY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: referenceKeyTypes.FAIL_FETCH_REFERENCE_KEY, response: error.response })
                });
        })
    }
}

export const showReferenceKey = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('reference_key/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: referenceKeyTypes.SUCCESS_SHOW_REFERENCE_KEY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: referenceKeyTypes.FAIL_SHOW_REFERENCE_KEY, response: error.response })
                });
        })
    }
}

export const deleteReferenceKey = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('reference_key/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: referenceKeyTypes.SUCCESS_DELETE_REFERENCE_KEY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: referenceKeyTypes.FAIL_DELETE_REFERENCE_KEY, response: error.response })
                });
        })
    }
}

export const saveReferenceKey = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('reference_key', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: referenceKeyTypes.SUCCESS_SAVE_REFERENCE_KEY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: referenceKeyTypes.FAIL_SAVE_REFERENCE_KEY, response: error.response })
                });
        })
    }
}
export const updateReferenceKey = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('reference_key/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: referenceKeyTypes.SUCCESS_UPDATE_REFERENCE_KEY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: referenceKeyTypes.SUCCESS_UPDATE_REFERENCE_KEY, response: error.response })
                });
        })
    }
}
export const syncReferenceKey = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_reference_key', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: referenceKeyTypes.SUCCESS_SYNC_REFERENCE_KEY,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: referenceKeyTypes.FAIL_SYNC_REFERENCE_KEY, response: error.response })
						});
        })
    }
}
