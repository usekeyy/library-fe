import axios from '../../../config/axios';
import * as OutlineAgreementTypes from '../../constants/tendering/OutlineAgreementTypes';

export const fetchOutlineAgreement = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('generate/book', {
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_FETCH_OUTLINE_AGREEMENT,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: OutlineAgreementTypes.FAIL_FETCH_OUTLINE_AGREEMENT, response: error.response })
                });
        })
    }
}

export const downloadBookPDF = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('generate/book', {
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_FETCH_OUTLINE_AGREEMENT,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: OutlineAgreementTypes.FAIL_FETCH_OUTLINE_AGREEMENT, response: error.response })
                });
        })
    }
}

export const showOutlineAgreement = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/outline_agreement/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_SHOW_OUTLINE_AGREEMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: OutlineAgreementTypes.FAIL_SHOW_OUTLINE_AGREEMENT, response: error.response })
                });
        })
    }
}

export const saveOutlineAgreement = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/outline_agreement/', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_SAVE_OUTLINE_AGREEMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: OutlineAgreementTypes.FAIL_SAVE_OUTLINE_AGREEMENT, response: error.response })
                });
        })
    }
}

export const fetchOutlineAgreementItemDetail = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/outline_agreement_item_detail/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_FETCH_OUTLINE_AGREEMENT_ITEM_DETAIL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: OutlineAgreementTypes.FAIL_FETCH_OUTLINE_AGREEMENT_ITEM_DETAIL, response: error.response })
                });
        })
    }
}

export const updateOutlineAgreementItemDetail = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/outline_agreement_update_item/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_UPDATE_OUTLINE_AGREEMENT_ITEM_DETAIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: OutlineAgreementTypes.FAIL_UPDATE_OUTLINE_AGREEMENT_ITEM_DETAIL, response: error.response })
                });
        })
    }
}

export const saveOutlineAgreementAdditionalCost = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/outline_agreement_add_additional_cost/', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_SAVE_OUTLINE_AGREEMENT_ADDITIONAL_COST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: OutlineAgreementTypes.FAIL_SAVE_OUTLINE_AGREEMENT_ADDITIONAL_COST, response: error.response })
                });
        })
    }
}

export const deleteOutlineAgreementAdditionalCost = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/outline_agreement_delete_additional_cost/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_DELETE_OUTLINE_AGREEMENT_ADDITIONAL_COST,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: OutlineAgreementTypes.FAIL_DELETE_OUTLINE_AGREEMENT_ADDITIONAL_COST, response: error.response })
                });
        })
    }
}

export const fetchDocumentOutlineAgreement = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/outline_agreement_attachment/'+id, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_FETCH_DOCUMENT_OUTLINE_AGREEMENT,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: OutlineAgreementTypes.FAIL_FETCH_DOCUMENT_OUTLINE_AGREEMENT, response: error.response })
                });
        })
    }
}

export const saveDocumentOutlineAgreement = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/outline_agreement_attachment/', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_SAVE_DOCUMENT_OUTLINE_AGREEMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: OutlineAgreementTypes.FAIL_SAVE_DOCUMENT_OUTLINE_AGREEMENT, response: error.response })
                });
        })
    }
}

export const deleteDocumentOutlineAgreement = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/outline_agreement_attachment/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_DELETE_DOCUMENT_OUTLINE_AGREEMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: OutlineAgreementTypes.FAIL_DELETE_DOCUMENT_OUTLINE_AGREEMENT, response: error.response })
                });
        })
    }
}

export const updateAccountAssignment = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/outline_agreement_update_account_assignment', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_UPDATE_ACCOUNT_ASSIGNMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: OutlineAgreementTypes.FAIL_UPDATE_ACCOUNT_ASSIGNMENT, response: error.response })
                });
        })
    }
}

export const syncPRPrice = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/sync_harga_pr_oa', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: OutlineAgreementTypes.SUCCESS_SYNC_PR_PRICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: OutlineAgreementTypes.FAIL_SYNC_PR_PRICE, response: error.response })
                });
        })
    }
}
