import axios from '../../../config/axios';
import * as grsaTypes from '../../constants/invoice/grsaTypes';

export const fetchGRSA = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/goods_receipt', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_FETCH_GR_SA,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: grsaTypes.FAIL_FETCH_GR_SA, response: error.response })
                });
        })
    }
}

export const showGRSA = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/goods_receipt/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_SHOW_GR_SA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_SHOW_GR_SA, response: error.response })
                });
        })
    }
}

export const syncGRSA = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/goods_receipt', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_SYNC_GR_SA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_SYNC_GR_SA, response: error.response })
                });
        })
    }
}

export const saveGRSA = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/goods_receipt', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_SAVE_GR_SA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_SAVE_GR_SA, response: error.response })
                });
        })
    }
}

export const fetchAdditionalCost = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/goods_receipt_add_cost', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_FETCH_ADDITIONAL_COST,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: grsaTypes.FAIL_FETCH_ADDITIONAL_COST, response: error.response })
                });
        })
    }
}

export const updateAdditionalCost = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/goods_receipt_add_cost', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_UPDATE_ADDITIONAL_COST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_UPDATE_ADDITIONAL_COST, response: error.response })
                });
        })
    }
}

export const fetchPenalty = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/goods_receipt_penalty', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_FETCH_PENALTY,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: grsaTypes.FAIL_FETCH_PENALTY, response: error.response })
                });
        })
    }
}

export const createPenalty = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/goods_receipt_penalty', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_CREATE_PENALTY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_CREATE_PENALTY, response: error.response })
                });
        })
    }
}

export const updatePenalty = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/goods_receipt_penalty', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_UPDATE_PENALTY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_UPDATE_PENALTY, response: error.response })
                });
        })
    }
}

export const deletePenalty = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('invoice/goods_receipt_penalty/' + id,)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_DELETE_PENALTY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_DELETE_PENALTY, response: error.response })
                });
        })
    }
}

export const fetchReportGRSA = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/goods_receipt_report', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_FETCH_GR_SA_REPORT,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: grsaTypes.FAIL_FETCH_GR_SA_REPORT, response: error.response })
                });
        })
    }
}

export const fetchPenaltyAdditionalCost = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/goods_receipt_add_cost_penalty', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_FETCH_PENALTY_ADDITIONAL_COST,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: grsaTypes.FAIL_FETCH_PENALTY_ADDITIONAL_COST, response: error.response })
                });
        })
    }
}

export const createPenaltyAdditionalCost = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/goods_receipt_add_cost_penalty', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_CREATE_PENALTY_ADDITIONAL_COST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_CREATE_PENALTY_ADDITIONAL_COST, response: error.response })
                });
        })
    }
}

export const deletePenaltyAdditionalCost = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('invoice/goods_receipt_add_cost_penalty/' + id,)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_DELETE_PENALTY_ADDITIONAL_COST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_DELETE_PENALTY_ADDITIONAL_COST, response: error.response })
                });
        })
    }
}

export const updatePenaltyAdditionalCost = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/goods_receipt_add_cost_penalty', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_UPDATE_PENALTY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_UPDATE_PENALTY, response: error.response })
                });
        })
    }
}

export const fetchEprocGRSA = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('invoice/get_purchase_order', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_FETCH_EPROC_GR_SA,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: grsaTypes.FAIL_FETCH_EPROC_GR_SA, response: error.response })
                });
        })
    }
}

export const saveEprocGRSA = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('invoice/goods_receipt_create', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_SAVE_EPROC_GR_SA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_SAVE_EPROC_GR_SA, response: error.response })
                });
        })
    }
}

export const cancelGRSA = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('invoice/goods_receipt_cancel/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: grsaTypes.SUCCESS_CANCEL_GR_SA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: grsaTypes.FAIL_CANCEL_GR_SA, response: error.response })
                });
        })
    }
}

