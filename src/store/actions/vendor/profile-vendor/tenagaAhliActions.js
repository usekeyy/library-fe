import axios from '../../../../config/axios';
import * as tenagaAhliTypes from '../../../constants/vendor/tenagaAhliTypes';

export const fetchTenagaAhli = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/vendor/${id}/tenaga_ahli`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: tenagaAhliTypes.SUCCESS_FETCH_TENAGA_AHLI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: tenagaAhliTypes.FAIL_FETCH_TENAGA_AHLI, response: error.response })
                });
        })
    }
}

export const showTenagaAhli = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vendor/' + vendor_uuid + '/tenaga_ahli/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: tenagaAhliTypes.SUCCESS_SHOW_TENAGA_AHLI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: tenagaAhliTypes.FAIL_SHOW_TENAGA_AHLI, response: error.response })
                });
        })
    }
}

export const deleteTenagaAhli = (vendor_uuid, uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vendor/' + vendor_uuid + '/tenaga_ahli/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: tenagaAhliTypes.SUCCESS_DELETE_TENAGA_AHLI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: tenagaAhliTypes.FAIL_DELETE_TENAGA_AHLI, response: error.response })
                });
        })
    }
}

export const saveTenagaAhli = (vendor_uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vendor/' + vendor_uuid + '/tenaga_ahli', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: tenagaAhliTypes.SUCCESS_SAVE_TENAGA_AHLI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: tenagaAhliTypes.FAIL_SAVE_TENAGA_AHLI, response: error.response })
                });
        })
    }
}
export const updateTenagaAhli = (vendor_uuid, uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vendor/' + vendor_uuid + '/tenaga_ahli/' + uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: tenagaAhliTypes.SUCCESS_UPDATE_TENAGA_AHLI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: tenagaAhliTypes.FAIL_UPDATE_TENAGA_AHLI, response: error.response })
                });
        })
    }
}