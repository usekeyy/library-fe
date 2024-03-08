import axios from '../../../config/axios';
import * as vprNewType from '../../constants/vendor/vprNewTypes';

export const fetchVprCategory = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_category', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_FETCH_VPR_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_FETCH_VPR_CATEGORY, response: error.response })
                });
        })
    }
}

export const showvVprCategory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_category/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_SHOW_VPR_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_SHOW_VPR_CATEGORY, response: error.response })
                });
        })
    }
}

export const deleteVprCategory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vpr_category/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_DELETE_VPR_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_DELETE_VPR_CATEGORY, response: error.response })
                });
        })
    }
}

export const saveVprCategory = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vpr_category', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_SAVE_VPR_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_SAVE_VPR_CATEGORY, response: error.response })
                });
        })
    }
}
export const updateVprCategory = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vpr_category/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_UPDATE_VPR_CATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_UPDATE_VPR_CATEGORY, response: error.response })
                });
        })
    }
}

//VPR RATING
export const fetchVprRating = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_rating', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_FETCH_VPR_RATING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_FETCH_VPR_RATING, response: error.response })
                });
        })
    }
}

export const showVprRating = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_rating/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_SHOW_VPR_RATING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_SHOW_VPR_RATING, response: error.response })
                });
        })
    }
}

export const deleteVprRating = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vpr_rating/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_DELETE_VPR_RATING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_DELETE_VPR_RATING, response: error.response })
                });
        })
    }
}

export const saveVprRating = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vpr_rating', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_SAVE_VPR_RATING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_SAVE_VPR_RATING, response: error.response })
                });
        })
    }
}
export const updateVprRating = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vpr_rating/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_UPDATE_VPR_RATING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_UPDATE_VPR_RATING, response: error.response })
                });
        })
    }
}


//VPR SUBCATEGORY
export const fetchVprSubCategory = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_subcategory', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_FETCH_VPR_SUBCATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_FETCH_VPR_SUBCATEGORY, response: error.response })
                });
        })
    }
}

export const showVprSubCategory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_subcategory/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_SHOW_VPR_SUBCATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_SHOW_VPR_SUBCATEGORY, response: error.response })
                });
        })
    }
}

export const deleteVprSubCategory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vpr_subcategory/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_DELETE_VPR_SUBCATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_DELETE_VPR_SUBCATEGORY, response: error.response })
                });
        })
    }
}

export const saveVprSubCategory = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vpr_subcategory', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_SAVE_VPR_SUBCATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_SAVE_VPR_SUBCATEGORY, response: error.response })
                });
        })
    }
}
export const updateVprSubCategory = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vpr_subcategory/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_UPDATE_VPR_SUBCATEGORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_UPDATE_VPR_SUBCATEGORY, response: error.response })
                });
        })
    }
}

//VPR Config
export const fetchVprConfig = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_config/'+uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_FETCH_VPR_CONFIG,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_FETCH_VPR_CONFIG, response: error.response })
                });
        })
    }
}

export const updateVprConfig = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vpr_config', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_UPDATE_VPR_CONFIG,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_UPDATE_VPR_CONFIG, response: error.response })
                });
        })
    }
}

// VPR PROSES
export const fetchVprPO = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_po', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_FETCH_VPR_PO,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_FETCH_VPR_PO, response: error.response })
                });
        })
    }
}

export const fetchVprDetailPenilaian = (uuidTemplate, uuidPo) => {
    let po = ""
    if (uuidPo){
        po = "/"+uuidPo
    }
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_config/' + uuidTemplate + po)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_FETCH_VPR_DETAIL_PENILAIAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_FETCH_VPR_DETAIL_PENILAIAN, response: error.response })
                });
        })
    }
}

export const saveVprPenilaian = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vpr_po', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_SAVE_VPR_PENILAIAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_SAVE_VPR_PENILAIAN, response: error.response })
                });
        })
    }
}

export const fetchVprApprovalDetailPenilaian = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_po/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_FETCH_VPR_DETAIL_PENILAIAN_APPROVER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_FETCH_VPR_DETAIL_PENILAIAN_APPROVER, response: error.response })
                });
        })
    }
}

export const approvePenilaianVPR = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vpr_po/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_UPDATE_VPR_APPROVE_PENILAIAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_UPDATE_VPR_APPROVE_PENILAIAN, response: error.response })
                });
        })
    }
}

//Attachment
export const fetchVprAttachment = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_attachment/'+uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_FETCH_VPR_ATTACHMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_FETCH_VPR_ATTACHMENT, response: error.response })
                });
        })
    }
}

export const deleteVprAttachment = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vpr_attachment/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_DELETE_VPR_ATTACHMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_DELETE_VPR_ATTACHMENT, response: error.response })
                });
        })
    }
}

export const saveVprAttachment = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vpr_attachment', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_SAVE_VPR_ATTACHMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_SAVE_VPR_ATTACHMENT, response: error.response })
                });
        })
    }
}

//History Approval
export const fetchVprHistory = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_po_history/'+uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_FETCH_VPR_HISTORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_FETCH_VPR_HISTORY, response: error.response })
                });
        })
    }
}

//VPR TEMPLATE
export const fetchVprTemplate = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_template', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_FETCH_VPR_TEMPLATE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_FETCH_VPR_TEMPLATE, response: error.response })
                });
        })
    }
}

export const showVprTemplate = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/vpr_template/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_SHOW_VPR_TEMPLATE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_SHOW_VPR_TEMPLATE, response: error.response })
                });
        })
    }
}

export const deleteVprTemplate = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('vendor_management/vpr_template/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_DELETE_VPR_TEMPLATE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_DELETE_VPR_TEMPLATE, response: error.response })
                });
        })
    }
}

export const saveVprTemplate = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/vpr_template', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_SAVE_VPR_TEMPLATE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_SAVE_VPR_TEMPLATE, response: error.response })
                });
        })
    }
}
export const updateVprTemplate = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/vpr_template/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: vprNewType.SUCCESS_UPDATE_VPR_TEMPLATE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: vprNewType.FAIL_UPDATE_VPR_TEMPLATE, response: error.response })
                });
        })
    }
}


