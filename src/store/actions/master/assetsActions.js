import axios from '../../../config/axios';
import * as assetsTypes from '../../constants/assetsTypes';

export const fetchAssets = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('asset', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: assetsTypes.SUCCESS_FETCH_ASSETS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: assetsTypes.FAIL_FETCH_ASSETS, response: error.response })
                });
        })
    }
}

export const showAssets = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('asset/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: assetsTypes.SUCCESS_SHOW_ASSETS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: assetsTypes.FAIL_SHOW_ASSETS, response: error.response })
                });
        })
    }
}

export const deleteAssets = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('asset/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: assetsTypes.SUCCESS_DELETE_ASSETS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: assetsTypes.FAIL_DELETE_ASSETS, response: error.response })
                });
        })
    }
}

export const saveAssets = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('asset', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: assetsTypes.SUCCESS_SAVE_ASSETS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: assetsTypes.FAIL_SAVE_ASSETS, response: error.response })
                });
        })
    }
}
export const updateAssets = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('asset/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: assetsTypes.SUCCESS_UPDATE_ASSETS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: assetsTypes.SUCCESS_UPDATE_ASSETS, response: error.response })
                });
        })
    }
}
export const syncAssets = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_asset', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: assetsTypes.SUCCESS_SYNC_ASSETS,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: assetsTypes.FAIL_SYNC_ASSETS, response: error.response })
						});
        })
    }
}
