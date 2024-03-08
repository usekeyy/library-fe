import axios from '../../../config/axios';
import * as actionTypes from '../../constants/tendering/purchasingRequisitionTypes';

export const downloadMonitoringPR = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/tendering/export_monitoring_pr`, {
                params: parameter,
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DOWNLOAD_MONITORING_PURCHASING_REQUISITION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DOWNLOAD_MONITORING_PURCHASING_REQUISITION, response: error.response })
                });
        })
    }
}

// SUBMIT PR
export const fetchPurchasingRequisition = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/purchasing_requisition', {
                params: parameter
            })
            .then(response => {
                resolve(response);
                dispatch({
                    type: actionTypes.SUCCESS_FETCH_PURCHASING_REQUISITION,
                    data: response.data
                })
            })
            .catch(error => {
                reject(error.response);
                dispatch({ type: actionTypes.FAIL_FETCH_PURCHASING_REQUISITION, response: error.response })
            });
        })
    }
}

export const showPurchasingRequisition = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/purchasing_requisition/${id}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SHOW_PURCHASING_REQUISITION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SHOW_PURCHASING_REQUISITION, response: error.response })
                });
        })
    }
}

export const updatePurchasingRequisition = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`tendering/purchasing_requisition/${id}`,payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_PURCHASING_REQUISITION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_UPDATE_PURCHASING_REQUISITION, response: error.response })
                });
        })
    }
}

export const uploadPurchasingRequisition = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`tendering/purchasing_requisition/${id}/attachment`,payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPLOAD_PURCHASING_REQUISITION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_UPLOAD_PURCHASING_REQUISITION, response: error.response })
                });
        })
    }
}

// PROCESSING PR
export const showPurchasingRequisitionListItem = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/purchasing_requisition/items/list`, {
                params: parameter
            })
            .then(response => {
                resolve(response);
                dispatch({
                    type: actionTypes.SUCCESS_SHOW_PURCHASING_REQUISITION_LIST_ITEM,
                    data: response.data
                })
            })
            .catch(error => {
                reject(error.response);
                dispatch({ type: actionTypes.FAIL_SHOW_PURCHASING_REQUISITION_LIST_ITEM, response: error.response })
            });
        })
    }
}

export const showPurchasingRequisitionListItemAssignProcessing = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/purchasing_requisition_item/assign_processing`, {
                params: parameter
            })
            .then(response => {
                resolve(response);
                dispatch({
                    type: actionTypes.SUCCESS_SHOW_PURCHASING_REQUISITION_LIST_ITEM_ASSIGN_PROCESSING,
                    data: response.data
                })
            })
            .catch(error => {
                reject(error.response);
                dispatch({ type: actionTypes.FAIL_SHOW_PURCHASING_REQUISITION_LIST_ITEM_ASSIGN_PROCESSING, response: error.response })
            });
        })
    }
}

export const showPurchasingRequisitionListAttachment = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/purchasing_requisition/attachments/list`, {
                params: payload
            })
            .then(response => {
                resolve(response);
                dispatch({
                    type: actionTypes.SUCCESS_SHOW_PURCHASING_REQUISITION_LIST_ATTACHMENT,
                    data: response.data
                })
            })
            .catch(error => {
                reject(error.response);
                dispatch({ type: actionTypes.FAIL_SHOW_PURCHASING_REQUISITION_LIST_ATTACHMENT, response: error.response })
            });
        })
    }
}

export const savePurchasingRequisitionAssign = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`tendering/purchasing_requisition/assign	`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SAVE_PURCHASING_REQUISITION_ASSIGN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SAVE_PURCHASING_REQUISITION_ASSIGN, response: error.response })
                });
        })
    }
}

export const fetchPurchasingRequisitionApproval = (params) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/purchasing_requisition_item`, {
                params: params
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_PURCHASING_REQUISITION_APPROVAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_FETCH_PURCHASING_REQUISITION_APPROVAL, response: error.response })
                });
        })
    }
}

// /tendering/purchasing_requisition/sycn
export const SyncPurchasingRequisitionAssign = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`/tendering/purchasing_requisition/sycn`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SYNC_PURCHASING_REQUISITION_APPROVAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SYNC_PURCHASING_REQUISITION_APPROVAL, response: error.response })
                });
        })
    }
}


export const ShowDetailPurchasingRequisition = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/tendering/purchasing_requisition/show_item/${id}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_SHOW_DETAIL_PURCHASING_REQUISITION_APPROVAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_SHOW_DETAIL_PURCHASING_REQUISITION_APPROVAL, response: error.response })
                });
        })
    }
}

export const HistoriesPurchasingRequisition = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/tendering/purchasing_requisition_item/history/${id}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_HISTORY_PURCHASING_REQUISITION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_HISTORY_PURCHASING_REQUISITION, response: error.response })
                });
        })
    }
}

// ASSIGN PR PROCESSING
export const assignPurchasingRequisition = (uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`tendering/purchasing_requisition_item/${uuid}/assign_processing`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_ASSIGN_PURCHASING_REQUISITION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_ASSIGN_PURCHASING_REQUISITION, response: error.response })
                });
        })
    }
}

// GET LIST USER PURCHASING REQUISITION ASSIGN
export const fetchUserList = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/user_buyer', {
                params: parameter
            })
            .then(response => {
                resolve(response);
                dispatch({
                    type: actionTypes.SUCCESS_FETCH_USER_PURCHASING_REQUISITION_ASSIGN,
                    data: response.data
                })
            })
            .catch(error => {
                reject(error.response);
                dispatch({ type: actionTypes.FAIL_FETCH_USER_PURCHASING_REQUISITION_ASSIGN, response: error.response })
            });
        })
    }
}

export const deleteAttacmentPurchasingRequisition = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete(`/tendering/purchasing_requisition/delete_upload/${id}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_ATTACMENT_PURCHASING_REQUISITION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_ATTACMENT_PURCHASING_REQUISITION, response: error.response })
                });
        })
    }
}

// Update no OA PR
export const updateOAPurchasingRequisition = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/update_outline_agreement_pr', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_OA_PURCHASING_REQUISITION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_UPDATE_OA_PURCHASING_REQUISITION, response: error.response })
                });
        })
    }
}

// Fetch PR OA
export const fetchPurchasingRequisitionOA = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/get_list_assignment_oa', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_PURCHASE_PURCHASING_REQUISITION_OA,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: actionTypes.FAIL_FETCH_PURCHASE_PURCHASING_REQUISITION_OA, response: error.response })
                });
        })
    }
}

export const deletePurchasingRequisitionItem = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/purchasing_requisition_item_delete/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_PURCHASING_REQUISITION_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_PURCHASING_REQUISITION_ITEM, response: error.response })
                });
        })
    }
}

export const deleteAssignPOOA = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/delete_assign_outline_agreement/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DELETE_ASSIGN_PO_OA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DELETE_ASSIGN_PO_OA, response: error.response })
                });
        })
    }
}

// Monitoring PR
export const fetchMonitoringPurchasingRequisition = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/monitoring_purchasing_requisition', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_FETCH_MONITORING_PURCHASING_REQUISITION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: actionTypes.FAIL_FETCH_MONITORING_PURCHASING_REQUISITION, response: error.response })
                });
        })
    }
}

export const downloadAssignmentPR = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/tendering/export_create_assignment_pr`, {
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_DOWNLOAD_ASSIGNMENT_PR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_DOWNLOAD_ASSIGNMENT_PR, response: error.response })
                });
        })
    }
}

export const updatePurchasingRequisitionItemStatusH = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/purchasing_requisition_item/' + id +'/update', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: actionTypes.SUCCESS_UPDATE_STATUS_H_PROCSI_ITEM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: actionTypes.FAIL_UPDATE_STATUS_H_PROCSI_ITEM, response: error.response })
                });
        })
    }
}