import axios from '../../../config/axios';
import * as durTypes from '../../constants/tendering/durTypes';

export const fetchDurList = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/dur', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_FETCH_DUR,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: durTypes.FAIL_FETCH_DUR, response: error.response })
                });
        })
    }
}

export const showDurDetail = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/dur_detail/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_SHOW_DUR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_SHOW_DUR, response: error.response })
                });
        })
    }
}

export const showDurHistory = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/dur_history/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_GET_HISTORY_DUR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_GET_HISTORY_DUR, response: error.response })
                });
        })
    }
}

export const showDurVendor = (id,parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/dur_vendor/'+id, {
                params : parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_SHOW_DUR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_SHOW_DUR, response: error.response })
                });
        })
    }
}

export const showFilterDurVendor = (id,parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/filter_dur_vendor/'+id, parameter)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_FETCH_DUR_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_FETCH_DUR_VENDOR, response: error.response })
                });
        })
    }
}

export const showEDocDUR = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/dur_e_doc/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_GET_EDOC_DUR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_GET_EDOC_DUR, response: error.response })
                });
        })
    }
}

export const showDurNotes = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/dur_note/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_SHOW_DUR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_SHOW_DUR, response: error.response })
                });
        })
    }
}

export const showDurVendorSelection = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/dur_vendor_selection/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_SHOW_DUR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_SHOW_DUR, response: error.response })
                });
        })
    }
}
export const showDurPersyaratanAdmin= (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/dur_persyaratan_admin/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_GET_PERSYARATAN_ADMIN_DUR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_GET_PERSYARATAN_ADMIN_DUR, response: error.response })
                });
        })
    }
}
export const showDurPersyaratanCommercial = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/dur_persyaratan_komersil/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_GET_PERSYARATAN_COMMECIAL_DUR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_GET_PERSYARATAN_COMMECIAL_DUR, response: error.response })
                });
        })
    }
}

export const storeDUR = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/dur', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_CREATE_DUR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_CREATE_DUR, response: error.response })
                });
        })
    }
}

export const syncrnVendorSAP = (uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/pull_vendor/'+uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_SYNCRN_VENDOR_SAP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_SYNCRN_VENDOR_SAP, response: error.response })
                });
        })
    }
}

export const approvalDUR = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/dur_approval/'+id,payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_APPROVE_DUR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.SUCCESS_APPROVE_DUR, response: error.response })
                });
        })
    }
}

export const downloadDurVendorDocument = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/doc_generate/${uuid}`, {
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: durTypes.SUCCESS_DOWNLOAD_DOC_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: durTypes.FAIL_DOWNLOAD_DOC_VENDOR, response: error.response })
                });
        })
    }
}