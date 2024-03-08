import axios from '../../../config/axios';
import * as divisionType from '../../constants/divisionTypes';

export const fetchDivision = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('division', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: divisionType.SUCCESS_FETCH_DIVISION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: divisionType.FAIL_FETCH_DIVISION, response: error.response })
                });
        })
    }
}

export const showDivision = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('division/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: divisionType.SUCCESS_SHOW_DIVISION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: divisionType.FAIL_SHOW_DIVISION, response: error.response })
                });
        })
    }
}

export const deleteDivision = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('division/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: divisionType.SUCCESS_DELETE_DIVISION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: divisionType.FAIL_DELETE_DIVISION, response: error.response })
                });
        })
    }
}

export const saveDivision = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('division', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: divisionType.SUCCESS_SAVE_DIVISION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: divisionType.FAIL_SAVE_DIVISION, response: error.response })
                });
        })
    }
}
export const updateDivision = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('division/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: divisionType.SUCCESS_UPDATE_DIVISION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: divisionType.FAIL_UPDATE_DIVISION, response: error.response })
                });
        })
    }
}