import axios from '../../../config/axios';
import * as praQualificationTypes from '../../constants/tendering/praQualificationTypes';

export const fetchPraQualificationList = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_FETCH_PRA_QUALIFICATION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_FETCH_PRA_QUALIFICATION, response: error.response })
                });
        })
    }
}
export const showPraQualificationDetail = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_SHOW_PRA_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: praQualificationTypes.FAIL_SHOW_PRA_QUALIFICATION, response: error.response })
                });
        })
    }
}
export const updatePraQualification = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/pra_qualification/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_UPDATE_PRA_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: praQualificationTypes.FAIL_UPDATE_PRA_QUALIFICATION, response: error.response })
                });
        })
    }
}


export const showPraQualificationVendorDetail = (id, param) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification_detail_by_vendor/'+id, {
                params: param})
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_SHOW_PRA_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: praQualificationTypes.FAIL_SHOW_PRA_QUALIFICATION, response: error.response })
                });
        })
    }
}

export const fetchPraQualificationTenderList = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification_list_tender', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_FETCH_PRA_QUALIFICATION_TENDER_LIST,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_FETCH_PRA_QUALIFICATION_TENDER_LIST, response: error.response })
                });
        })
    }
}

export const fetchPraQualificationVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_FETCH_VENDOR_PRA_QUALIFICATION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_FETCH_VENDOR_PRA_QUALIFICATION, response: error.response })
                });
        })
    }
}

export const savePraQualificationRegisterVendor = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/pra_qualification_registrasi_vendor', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_REGISTER_PRA_QUALIFICATION_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: praQualificationTypes.FAIL_REGISTER_PRA_QUALIFICATION_VENDOR, response: error.response })
                });
        })
    }
}

export const fetchPraQualificationKlarifikasi = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification_klarifikasi', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_FETCH_KLARIFIKASI_PRA_QUALIFICATION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_FETCH_KLARIFIKASI_PRA_QUALIFICATION, response: error.response })
                });
        })
    }
}

export const savePraQualificationKlarifikasi = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/pra_qualification_klarifikasi', parameter)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_CREATE_KLARIFIKASI_PRA_QUALIFICATION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_CREATE_KLARIFIKASI_PRA_QUALIFICATION, response: error.response })
                });
        })
    }
}

export const showPraQualificationNotes = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/pra_qualification_note/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_SHOW_PRA_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: praQualificationTypes.FAIL_SHOW_PRA_QUALIFICATION, response: error.response })
                });
        })
    }
}

export const savePraQualificationNotes = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/pra_qualification_note', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_SAVE_PRA_QUALIFICATION_NOTE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: praQualificationTypes.FAIL_SAVE_PRA_QUALIFICATION_NOTE, response: error.response })
                });
        })
    }
}

export const fetchPraQualificationPersyaratan = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification_persyaratan/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_FETCH_PRA_QUALIFICATION_PERSYARATAN,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_FETCH_PRA_QUALIFICATION_PERSYARATAN, response: error.response })
                });
        })
    }
}

export const updatePraQualificationPersyaratan = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/pra_qualification_persyaratan/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_UPDATE_PERSYARATAN_PRA_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: praQualificationTypes.FAIL_UPDATE_PERSYARATAN_PRA_QUALIFICATION, response: error.response })
                });
        })
    }
}

export const fetchPraQualificationPersyaratanTambahan = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification_persyaratan_tambahan', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_FETCH_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_FETCH_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN, response: error.response })
                });
        })
    }
}

export const showPraQualificationPersyaratanTambahan = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification_persyaratan_tambahan/'+id, {
                params : payload
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_SHOW_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: praQualificationTypes.FAIL_SHOW_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN, response: error.response })
                });
        })
    }
}

export const savePraQualificationPersyaratanTambahan = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/pra_qualification_persyaratan_tambahan', payload)
                .then(response => {
                        resolve(response);
                        dispatch({
                                type: praQualificationTypes.SUCCESS_CREATE_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN,
                                data: response.data
                        })
                })
                .catch(error => {
                        reject(error.response);
                        dispatch({ type: praQualificationTypes.FAIL_CREATE_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN, response: error.response })
                });
        })
    }
}
export const updatePraQualificationPersyaratanTambahan = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/pra_qualification_persyaratan_tambahan/' + id, payload)
                .then(response => {
                        resolve(response);
                        dispatch({
                                type: praQualificationTypes.SUCCESS_UPDATE_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN,
                                data: response.data
                        })
                })
                .catch(error => {
                        reject(error.response);
                        dispatch({ type: praQualificationTypes.FAIL_UPDATE_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN, response: error.response })
                });
        })
    }
}
export const deletePraQualificationPersyaratanTambahan = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/pra_qualification_persyaratan_tambahan/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_DELETE_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: praQualificationTypes.FAIL_DELETE_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN, response: error.response })
                });
        })
    }
}

export const fetchPraQualificationPersyaratanVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification_persyaratan_registrasi_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_FETCH_PRA_QUALIFICATION_PERSYARATAN_VENDOR,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_FETCH_PRA_QUALIFICATION_PERSYARATAN_VENDOR, response: error.response })
                });
        })
    }
}

export const savePraQualificationDokumenPersyaratanTambahan = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/pra_qualification_persyaratan_tambahan', payload)
                .then(response => {
                        resolve(response);
                        dispatch({
                                type: praQualificationTypes.SUCCESS_CREATE_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN,
                                data: response.data
                        })
                })
                .catch(error => {
                        reject(error.response);
                        dispatch({ type: praQualificationTypes.FAIL_CREATE_PRA_QUALIFICATION_PERSYARATAN_TAMBAHAN, response: error.response })
                });
        })
    }
}

export const showUserVendorDetail = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pq_vendor/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_FETCH_USER_VENDOR_DETAIL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_FETCH_USER_VENDOR_DETAIL, response: error.response })
                });
        })
    }
}

export const fetchPraQualificationEvaluasiVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification_evaluasi', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_FETCH_PRA_QUALIFICATION_EVALUASI_VENDOR,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_FETCH_PRA_QUALIFICATION_EVALUASI_VENDOR, response: error.response })
                });
        })
    }
}

export const savePraQualificationEvaluasiVendor = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/pra_qualification_evaluasi', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_SAVE_PRA_QUALIFICATION_EVALUASI_VENDOR,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_SAVE_PRA_QUALIFICATION_EVALUASI_VENDOR, response: error.response })
                });
        })
    }
}

export const savePraQualificationDokumenPersyaratanVendor = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/pra_qualification_vendor_syarat_tambahan_value', payload)
                .then(response => {
                        resolve(response);
                        dispatch({
                                type: praQualificationTypes.SUCCESS_SAVE_PRA_QUALIFICATION_DOKUMEN_PERSYARATAN_VENDOR,
                                data: response.data
                        })
                })
                .catch(error => {
                        reject(error.response);
                        dispatch({ type: praQualificationTypes.FAIL_SAVE_PRA_QUALIFICATION_DOKUMEN_PERSYARATAN_VENDOR, response: error.response })
                });
        })
    }
}

export const approvalPraQualification = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/pra_qualification_approve/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_APPROVAL_PRA_QUALIFICATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: praQualificationTypes.SUCCESS_APPROVAL_PRA_QUALIFICATION, response: error.response })
                });
        })
    }
}

export const countPraQualificationKlarifikasi = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/pra_qualification_count_klarifikasi_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: praQualificationTypes.SUCCESS_FETCH_PRA_QUALIFICATION_KLARIFIKASI,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: praQualificationTypes.FAIL_FETCH_PRA_QUALIFICATION_KLARIFIKASI, response: error.response })
                });
        })
    }
}
