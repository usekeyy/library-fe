import axios from '../../../config/axios';
import * as wbsProjectTypes from '../../constants/wbsProjectTypes';

export const fetchWbsProject = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('wbs_project', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: wbsProjectTypes.SUCCESS_FETCH_WBS_PROJECT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: wbsProjectTypes.FAIL_FETCH_WBS_PROJECT, response: error.response })
                });
        })
    }
}

export const showWbsProject = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('wbs_project/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: wbsProjectTypes.SUCCESS_SHOW_WBS_PROJECT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: wbsProjectTypes.FAIL_SHOW_WBS_PROJECT, response: error.response })
                });
        })
    }
}

export const deleteWbsProject = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('wbs_project/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: wbsProjectTypes.SUCCESS_DELETE_WBS_PROJECT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: wbsProjectTypes.FAIL_DELETE_WBS_PROJECT, response: error.response })
                });
        })
    }
}

export const saveWbsProject = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('wbs_project', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: wbsProjectTypes.SUCCESS_SAVE_WBS_PROJECT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: wbsProjectTypes.FAIL_SAVE_WBS_PROJECT, response: error.response })
                });
        })
    }
}
export const updateWbsProject = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('wbs_project/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: wbsProjectTypes.SUCCESS_UPDATE_WBS_PROJECT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: wbsProjectTypes.SUCCESS_UPDATE_WBS_PROJECT, response: error.response })
                });
        })
    }
}
export const syncWbsProject = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('sync_wbs_project', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: wbsProjectTypes.SUCCESS_SYNC_WBS_PROJECT,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: wbsProjectTypes.FAIL_SYNC_WBS_PROJECT, response: error.response })
						});
        })
    }
}
