import axios from '../../../config/axios';
import * as monitoringTypes from '../../constants/tendering/monitoringMrsrTypes';

export const fetchMonitoringMrsr = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_request/monitoring_material_service', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_FETCH_MONITORING_MRSR,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringTypes.FAIL_FETCH_MONITORING_MRSR, response: error.response })
                });
        })
    }
}

export const showMonitoringMrsr = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('material_request/monitoring_material_service/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_SHOW_MONITORING_MRSR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_SHOW_MONITORING_MRSR, response: error.response })
                });
        })
    }
}

export const updateMonitoringMrsr = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('material_request/monitoring_material_service/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_UPDATE_MONITORING_MRSR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_UPDATE_MONITORING_MRSR, response: error.response })
                });
        })
    }
}