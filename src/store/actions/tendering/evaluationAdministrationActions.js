import axios from '../../../config/axios';
import * as evaluationTypes from '../../constants/tendering/evaluationTypes';

export const fetchEvaluation = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/evaluasi_admin', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluationTypes.SUCCESS_FETCH_EVALUATION_ADMINISTRASI,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluationTypes.FAIL_FETCH_EVALUATION_ADMINISTRASI, response: error.response })
                });
        })
    }
}

export const showDetailEvaluation = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/evaluasi_admin_detail/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluationTypes.SUCCESS_SHOW_EVALUATION_ADMINISTRASI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: evaluationTypes.FAIL_SHOW_EVALUATION_ADMINISTRASI, response: error.response })
                });
        })
    }
}
export const showDetailVendorEvaluation = (uuid, uuid_vendor) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/evaluasi_admin_proses/${uuid}/${uuid_vendor}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluationTypes.SUCCESS_SHOW_VENDOR_EVALUATION_ADMINISTRASI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: evaluationTypes.FAIL_SHOW_VENDOR_EVALUATION_ADMINISTRASI, response: error.response })
                });
        })
    }
}

export const publishEvaluasiAdmin = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/evaluasi_admin_publish', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluationTypes.SUCCESS_PUBLISH_EVALUATION_ADMINISTRASI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: evaluationTypes.FAIL_PUBLISH_EVALUATION_ADMINISTRASI, response: error.response })
                });
        })
    }
}

export const prosesEvaluasiAdmin = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/evaluasi_admin_proses', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluationTypes.SUCCESS_PROCESS_EVALUATION_ADMINISTRASI,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: evaluationTypes.FAIL_PROCESS_EVALUATION_ADMINISTRASI, response: error.response })
                });
        })
    }
}