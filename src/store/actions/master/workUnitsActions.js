import axios from '../../../config/axios';
import * as workUnitsType from '../../constants/workUnitsType';

export const fetchWorkUnits = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('work_unit', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: workUnitsType.SUCCESS_FETCH_WORK_UNITS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: workUnitsType.FAIL_FETCH_WORK_UNITS, response: error.response })
                });
        })
    }
}

export const showWorkUnits = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('work_unit/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: workUnitsType.SUCCESS_SHOW_WORK_UNITS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: workUnitsType.FAIL_SHOW_WORK_UNITS, response: error.response })
                });
        })
    }
}

export const deleteWorkUnits = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('work_unit/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: workUnitsType.SUCCESS_DELETE_WORK_UNITS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: workUnitsType.FAIL_DELETE_WORK_UNITS, response: error.response })
                });
        })
    }
}

export const saveWorkUnits = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('work_unit', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: workUnitsType.SUCCESS_SAVE_WORK_UNITS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: workUnitsType.FAIL_SAVE_WORK_UNITS, response: error.response })
                });
        })
    }
}
export const updateWorkUnits = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('work_unit/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: workUnitsType.SUCCESS_UPDATE_WORK_UNITS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: workUnitsType.FAIL_UPDATE_WORK_UNITS, response: error.response })
                });
        })
    }
}