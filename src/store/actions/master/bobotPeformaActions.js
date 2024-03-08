import axios from '../../../config/axios';
import * as actionTypes from '../../constants/bobotPeformaTypes';

export const fetchBobotPeforma = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            console.log(parameter)
            axios.get('vendor_management/bobot_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_BOBOTPEFORMA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_BOBOTPEFORMA, response: error.response })
                });
        })
    }
}

export const showBobotPeforma = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/bobot_vendor/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SHOW_BOBOTPEFORMA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SHOW_BOBOTPEFORMA, response: error.response })
                });
        })
    }
}

export const deleteBobotPeforma = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/bobot_vendor/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_BOBOTPEFORMA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_BOBOTPEFORMA, response: error.response })
                });
        })
    }
}

export const saveBobotPeforma = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/bobot_vendor', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_BOBOTPEFORMA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_SAVE_BOBOTPEFORMA, response: error.response })
                });
        })
    }
}
export const updateBobotPeforma = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/bobot_vendor/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_BOBOTPEFORMA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.SUCCESS_UPDATE_BOBOTPEFORMA, response: error.response })
                });
        })
    }
}