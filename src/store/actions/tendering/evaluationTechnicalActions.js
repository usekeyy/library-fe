import axios from '../../../config/axios';
import * as evaluasiTeknisTypes from '../../constants/tendering/evaluasiTeknisTypes';

export const fetchEvaluationTeknis = (type,source,parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_teknis/'+type+'/'+source, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_FETCH_LIST_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_FETCH_LIST_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const showEvaluationTeknis = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_assignment_detail/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_SHOW_DETAIL_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_SHOW_DETAIL_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const showAssignToTeknis = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_list_assignment/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_SHOW_ASSIGNMENT_TO_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_SHOW_ASSIGNMENT_TO_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const showListVendorProcessTeknis = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_assignment_evaluasi_teknis/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_SHOW_VENDOR_PROCESS_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_SHOW_VENDOR_PROCESS_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const showProcessEvaluasiTeknis = (uuid,vendor_uuid, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_teknis_score/'+uuid+'/'+vendor_uuid,{
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_SHOW_DETAIL_EVALUASI_PROCESS_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_SHOW_DETAIL_EVALUASI_PROCESS_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const showVendorEvaluasiTeknis = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_assignment_evaluasi_teknis/'+uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_GET_VENDOR_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_GET_VENDOR_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const saveEvaluasiTeknisAssignment = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/evaluasi_assignment', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_SAVE_ASSIGNMENT_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_SAVE_ASSIGNMENT_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const saveEvaluasiTeknisScore = (id, payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/evaluasi_teknis_score/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_SAVE_ASSIGNMENT_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_SAVE_ASSIGNMENT_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const saveEvaluasiTeknisPublish = (id, payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/evaluasi_teknis_submit/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_SAVE_ASSIGNMENT_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_SAVE_ASSIGNMENT_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const storeEvaluasiTeknisKlarifikasi = (payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/evaluasi_teknis_klarifikasi', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_SAVE_KLARIFIKASI_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_SAVE_KLARIFIKASI_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const getEvaluasiTeknisKlarifikasi = (uuid, vendor_id, payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_teknis_klarifikasi/'+uuid+'/'+vendor_id, {params: payload})
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_GET_KLARIFIKASI_EVALUASI_PROCESS_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.SUCCESS_GET_KLARIFIKASI_EVALUASI_PROCESS_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}

export const getEvaluasiTeknisAttactment = (uuid, vendor_id, payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_teknis_attachment/'+uuid+`/${vendor_id}`, {
                params : payload
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_GET_ATTACTMENT_VENDOR_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_GET_ATTACTMENT_VENDOR_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const storeEvaluasiTeknisAttactment = (payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/evaluasi_teknis_attachment/',payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_STORE_ATTACTMENT_VENDOR_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_STORE_ATTACTMENT_VENDOR_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const deleteEvaluasiTeknisAttactment = (payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/evaluasi_teknis_attachment/'+payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_DELETE_ATTACTMENT_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_DELETE_ATTACTMENT_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const storeEvaluasiTeknisSyarat = (id,payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/evaluasi_teknis_syarat/'+id,payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_STORE_SYARAT_VENDOR_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_STORE_SYARAT_VENDOR_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}

export const putEvaluasiTeknisSyarat = (uuid,type,payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/evaluasi_teknis_syarat/'+uuid+'/'+type,payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_STORE_ATTACTMENT_VENDOR_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_STORE_ATTACTMENT_VENDOR_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}

export const getEvaluasiTeknisCatatan= (uuid)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_teknis_catatan/'+uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_GET_CATATAN_VENDOR_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_GET_CATATAN_VENDOR_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}

export const getEvaluasiTeknisCompare= (uuid,pr_item_id,pr_service_id)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/tendering/evaluasi_detail_penawaran/${uuid}/${pr_item_id}/${pr_service_id}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_GET_COMPARE_DEVIATE_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_GET_COMPARE_DEVIATE_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}
export const getEvaluasiTeknisSyarat= (uuid)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_assignment_syarat/'+uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_GET_CATATAN_VENDOR_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_GET_CATATAN_VENDOR_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}

export const storeEvaluasiTeknisCatatan= (uuid, payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/evaluasi_teknis_catatan/'+uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_STORE_CATATAN_VENDOR_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_STORE_CATATAN_VENDOR_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}

export const storeEvaluasiTeknisConfig= (uuid, payload)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/evaluasi_configurasi_bobot/'+uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_STORE_CATATAN_VENDOR_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_STORE_CATATAN_VENDOR_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}

export const getListTableTaskEvaluasiTeknisVendor = (parameter)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_teknis_klarifikasi_list_table',{params : parameter})
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_GET_LIST_VENDOR_TABLE_TASK_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_GET_LIST_VENDOR_TABLE_TASK_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}

export const getDetailTaskVendorEvaluasiTeknis= (uuid)  => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_teknis_klarifikasi_list/'+uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiTeknisTypes.SUCCESS_GET_DETAIL_TASK_VENDOR__TASK_AVALUASI_TEKNIS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiTeknisTypes.FAIL_GET_DETAIL_TASK_VENDOR__TASK_AVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}