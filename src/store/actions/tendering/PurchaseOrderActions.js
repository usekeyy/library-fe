import axios from '../../../config/axios';
import * as purchaseOrderTypes from '../../constants/tendering/purchaseOrderTypes';

export const fetchPurchaseOrder = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/purchase_order', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_FETCH_PURCHASE_ORDER,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: purchaseOrderTypes.FAIL_FETCH_PURCHASE_ORDER, response: error.response })
                });
        })
    }
}

export const showPurchaseOrder = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/purchase_order/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_SHOW_PURCHASE_ORDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_SHOW_PURCHASE_ORDER, response: error.response })
                });
        })
    }
}

export const savePurchaseOrder = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/purchase_order/', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_SAVE_PURCHASE_ORDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_SAVE_PURCHASE_ORDER, response: error.response })
                });
        })
    }
}

export const fetchPurchaseOrderItemDetail = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/purchase_order_item_detail/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_FETCH_PURCHASE_ORDER_ITEM_DETAIL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: purchaseOrderTypes.FAIL_FETCH_PURCHASE_ORDER_ITEM_DETAIL, response: error.response })
                });
        })
    }
}

export const updatePurchaseOrderItemDetail = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/purchase_order_item/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_UPDATE_PURCHASE_ORDER_ITEM_DETAIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_UPDATE_PURCHASE_ORDER_ITEM_DETAIL, response: error.response })
                });
        })
    }
}

export const savePurchaseOrderAdditionalCost = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/purchase_order_additional_cost/', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_SAVE_PURCHASE_ORDER_ADDITIONAL_COST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_SAVE_PURCHASE_ORDER_ADDITIONAL_COST, response: error.response })
                });
        })
    }
}

export const deletePurchaseOrderAdditionalCost = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/purchase_order_additional_cost/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_DELETE_PURCHASE_ORDER_ADDITIONAL_COST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_DELETE_PURCHASE_ORDER_ADDITIONAL_COST, response: error.response })
                });
        })
    }
}

export const approvalVendorPurchaseOrder = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/purchase_order_confirm_vendor/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_APPROVAL_VENDOR_PURCHASE_ORDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_APPROVAL_VENDOR_PURCHASE_ORDER, response: error.response })
                });
        })
    }
}

export const approvalPurchaseOrder = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/purchase_order_approve/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_APPROVAL_PURCHASE_ORDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_APPROVAL_PURCHASE_ORDER, response: error.response })
                });
        })
    }
}

export const releasePurchaseOrder = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/purchase_order_release/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_RELEASE_PURCHASE_ORDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_RELEASE_PURCHASE_ORDER, response: error.response })
                });
        })
    }
}

export const fetchDocumentPurchaseOrder = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/purchase_order_get_document/'+id, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_FETCH_DOCUMENT_PURCHASE_ORDER,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: purchaseOrderTypes.FAIL_FETCH_DOCUMENT_PURCHASE_ORDER, response: error.response })
                });
        })
    }
}

export const saveDocumentPurchaseOrder = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/purchase_order_upload_document/', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_SAVE_DOCUMENT_PURCHASE_ORDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_SAVE_DOCUMENT_PURCHASE_ORDER, response: error.response })
                });
        })
    }
}

export const deleteDocumentPurchaseOrder = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/purchase_order_delete_document/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_DELETE_DOCUMENT_PURCHASE_ORDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_DELETE_DOCUMENT_PURCHASE_ORDER, response: error.response })
                });
        })
    }
}

export const updateAccountAssignment = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/purchase_order_update_account_assignment', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_UPDATE_ACCOUNT_ASSIGNMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_UPDATE_ACCOUNT_ASSIGNMENT, response: error.response })
                });
        })
    }
}

export const syncPurchaseOrder = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/purchase_order_sync/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_SYNC_PURCHASE_ORDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_SYNC_PURCHASE_ORDER, response: error.response })
                });
        })
    }
}

export const savePurchaseOrderOA = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/create_purchase_order_oa', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_SAVE_PURCHASE_ORDER_OA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_SAVE_PURCHASE_ORDER_OA, response: error.response })
                });
        })
    }
}

export const updatePurchaseOrderOATemp = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/submit_temp_purchase_order_oa/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_UPDATE_PURCHASE_ORDER_OA_TEMPORARY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_UPDATE_PURCHASE_ORDER_OA_TEMPORARY, response: error.response })
                });
        })
    }
}

export const deletePurchaseOrderOATemp = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/delete_temp_purchase_order_oa/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_DELETE_PURCHASE_ORDER_OA_TEMPORARY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_DELETE_PURCHASE_ORDER_OA_TEMPORARY, response: error.response })
                });
        })
    }
}

export const fetchVendorAwarding = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/purchase_order_vendor_awarding', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_FETCH_VENDOR_AWARDING,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: purchaseOrderTypes.FAIL_FETCH_VENDOR_AWARDING, response: error.response })
                });
        })
    }
}

export const purchaseOrderCancel = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/purchase_order_cancel', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_PURCHASE_ORDER_CANCEL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_PURCHASE_ORDER_CANCEL, response: error.response })
                });
        })
    }
}

export const purchaseOrderApprovalCancel = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/purchase_order_approve_cancel', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_PURCHASE_ORDER_APPROVAL_CANCEL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_PURCHASE_ORDER_APPROVAL_CANCEL, response: error.response })
                });
        })
    }
}

export const fetchMultipleDetailPurchaseOrder = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/purchase_order_detail_multiple', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: purchaseOrderTypes.SUCCESS_FETCH_MULTIPLE_PURCHASE_ORDER_DETAIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: purchaseOrderTypes.FAIL_FETCH_MULTIPLE_PURCHASE_ORDER_DETAIL, response: error.response })
                });
        })
    }
}

