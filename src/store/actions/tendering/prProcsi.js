import axios from '../../../config/axios';
import * as actionTypes from '../../constants/tendering/purchasingRequisitionTypes';

export const saveHeader = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`tendering/procsi/pr_header`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_PR_PROCSI_HEADER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SAVE_PR_PROCSI_HEADER, response: error.response })
                });
        })
    }
}

export const saveItem = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`tendering/procsi/pr_item/${id}`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_PR_PROCSI_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SAVE_PR_PROCSI_ITEM, response: error.response })
                });
        })
    }
}

export const saveServiceItem = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`tendering/procsi/service_line/${id}`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_PR_SERVICE_PROCSI_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SAVE_PR_SERVICE_PROCSI_ITEM, response: error.response })
                });
        })
    }
}

export const getServiceItem = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/procsi/pr_item/${id}/service`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_GET_PR_SERVICE_PROCSI_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_GET_PR_SERVICE_PROCSI_ITEM, response: error.response })
                });
        })
    }
}
export const deleteItemsService = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/procsi/service_line/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_PR_SERVICE_PROCSI_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_PR_SERVICE_PROCSI_ITEM, response: error.response })
                });
        })
    }
}
export const deleteItemsPr = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/procsi/pr_item/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_PR_ITEMS_PROCSI_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_PR_ITEMS_PROCSI_ITEM, response: error.response })
                });
        })
    }
}


export const updateItemsServiceLine = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/procsi/service_line/'+ id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_ITEM_SERVICE_LINE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_UPDATE_ITEM_SERVICE_LINE, response: error.response })
                });
        })
    }
}
export const updateItemsPr = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/procsi/pr_item/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_LINE_ITEM_PR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_UPDATE_LINE_ITEM_PR, response: error.response })
                });
        })
    }
}
