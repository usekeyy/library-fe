import axios from '../../../config/axios';
import * as regionsType from '../../constants/regionsType';

export const fetchRegions = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('region', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: regionsType.SUCCESS_FETCH_REGIONS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: regionsType.FAIL_FETCH_REGIONS, response: error.response })
                });
        })
    }
}

export const showRegions = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('region/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: regionsType.SUCCESS_SHOW_REGIONS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: regionsType.FAIL_SHOW_REGIONS, response: error.response })
                });
        })
    }
}

export const deleteRegions = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('region/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: regionsType.SUCCESS_DELETE_REGIONS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: regionsType.FAIL_DELETE_REGIONS, response: error.response })
                });
        })
    }
}

export const saveRegions = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('region', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: regionsType.SUCCESS_SAVE_REGIONS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: regionsType.FAIL_SAVE_REGIONS, response: error.response })
                });
        })
    }
}
export const updateRegions = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('region/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: regionsType.SUCCESS_UPDATE_REGIONS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: regionsType.FAIL_UPDATE_REGIONS, response: error.response })
                });
        })
    }
}