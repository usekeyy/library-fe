import axios from '../../../config/axios';
import * as materialServiceRequestTypes from '../../constants/material-service/materialServiceRequestTypes';

export const fetchMaterialServices = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_request/material_service_request', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialServiceRequestTypes.SUCCESS_FETCH_MATERIAL_SERVICE_REQUEST,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: materialServiceRequestTypes.FAIL_FETCH_MATERIAL_SERVICE_REQUEST, response: error.response })
                });
        })
    }
}

export const showMaterialServices = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_request/material_service_request/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialServiceRequestTypes.SUCCESS_SHOW_MATERIAL_SERVICE_REQUEST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialServiceRequestTypes.FAIL_SHOW_MATERIAL_SERVICE_REQUEST, response: error.response })
                });
        })
    }
}

export const showHistoryMaterialServices = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/material_request/material_service_request/history/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialServiceRequestTypes.SUCCESS_HISTORY_MATERIAL_SERVICE_REQUEST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialServiceRequestTypes.FAIL_HISTORY_MATERIAL_SERVICE_REQUEST, response: error.response })
                });
        })
    }
}

export const deleteMaterialServices = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('material_request/material_service_request/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialServiceRequestTypes.SUCCESS_DELETE_MATERIAL_SERVICE_REQUEST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialServiceRequestTypes.FAIL_DELETE_MATERIAL_SERVICE_REQUEST, response: error.response })
                });
        })
    }
}

export const saveMaterialServices = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('material_request/material_service_request', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialServiceRequestTypes.SUCCESS_SAVE_MATERIAL_SERVICE_REQUEST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialServiceRequestTypes.FAIL_SAVE_MATERIAL_SERVICE_REQUEST, response: error.response })
                });
        })
    }
}

export const updateMaterialServices = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('material_request/material_service_request/' + id,payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialServiceRequestTypes.SUCCESS_UPDATE_MATERIAL_SERVICE_REQUEST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialServiceRequestTypes.FAIL_UPDATE_MATERIAL_SERVICE_REQUEST, response: error.response })
                });
        })
    }
}

export const assgnMaterialServices = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('material_request/material_service_request/assign/' + id,payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialServiceRequestTypes.SUCCESS_UPDATE_MATERIAL_SERVICE_REQUEST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialServiceRequestTypes.FAIL_UPDATE_MATERIAL_SERVICE_REQUEST, response: error.response })
                });
        })
    }
}

//PR Manual
export const submitPRManual = (uuid,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`tendering/procsi/submit/${uuid}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialServiceRequestTypes.SUCCESS_SUBMIT_PR_MANUAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialServiceRequestTypes.FAIL_SUBMIT_PR_MANUAL, response: error.response })
                });
        })
    }
}

export const approvalPRManual = (uuid,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`tendering/procsi/approve/${uuid}`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: materialServiceRequestTypes.SUCCESS_APPROVAL_PR_MANUAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: materialServiceRequestTypes.FAIL_APPROVAL_PR_MANUAL, response: error.response })
                });
        })
    }
}
