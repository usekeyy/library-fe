import axios from '../../../config/axios';
import * as evaluasiKomersialTypes from '../../constants/tendering/evaluasiKomersialTypes';

export const fetchEvaluationKomersial = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_komersil', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiKomersialTypes.SUCCESS_FETCH_LIST_EVALUATION_COMMERCIAL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiKomersialTypes.FAIL_FETCH_LIST_EVALUATION_COMMERCIAL, response: error.response })
                });
        })
    }
}
export const showEvaluationCommersial = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_komersil_detail/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiKomersialTypes.SUCCESS_SHOW_EVALUATION_COMMERCIAL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiKomersialTypes.FAIL_SHOW_EVALUATION_COMMERCIAL, response: error.response })
                });
        })
    }
}
export const getEvaluationCommersialConfig = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/evaluasi_komersil_config/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiKomersialTypes.SUCCESS_GET_EVALUATION_COMMERCIAL_CONFIGURATION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiKomersialTypes.FAIL_GET_EVALUATION_COMMERCIAL_CONFIGURATION, response: error.response })
                });
        })
    }
}

export const getEvaluationCommersialProcessVendor = (id,vendor_id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/komersil_proses_detail/'+id+'/'+vendor_id ,{
                params : payload
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiKomersialTypes.SUCCESS_GET_EVALUATION_COMMERCIAL_PROCESS_VENDOR,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiKomersialTypes.FAIL_GET_EVALUATION_COMMERCIAL_PROCESS_VENDOR, response: error.response })
                });
        })
    }
}

export const getEvaluationCommersialDocumentVendor = (id,vendor_id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/komersil_document_vendor/'+id+'/'+vendor_id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiKomersialTypes.SUCCESS_GET_EVALUATION_COMMERCIAL_PROCESS_VENDOR,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiKomersialTypes.FAIL_GET_EVALUATION_COMMERCIAL_PROCESS_VENDOR, response: error.response })
                });
        })
    }
}

export const getEvaluationCommersialEvaluasi = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/komersil_rekap_evaluasi/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiKomersialTypes.SUCCESS_GET_EVALUATION_COMMERCIAL_CONFIGURATION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiKomersialTypes.FAIL_GET_EVALUATION_COMMERCIAL_CONFIGURATION, response: error.response })
                });
        })
    }
}
export const storeConfiguration = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/evaluasi_komersil_config/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiKomersialTypes.SUCCESS_STORE_EVALUATION_COMMERCIAL_CONFIGURATION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiKomersialTypes.FAIL_STORE_EVALUATION_COMMERCIAL_CONFIGURATION, response: error.response })
                });
        })
    }
}
export const storeEvaluasiCommersialPublish= (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/komersil_publish/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiKomersialTypes.SUCCESS_STORE_EVALUATION_COMMERCIAL_PUBLISH,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiKomersialTypes.FAIL_STORE_EVALUATION_COMMERCIAL_PUBLISH, response: error.response })
                });
        })
    }
}

export const storeEvaluasiCommersialProses= (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/komersil_proses/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: evaluasiKomersialTypes.SUCCESS_STORE_EVALUATION_COMMERCIAL_PROCESS,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: evaluasiKomersialTypes.FAIL_STORE_EVALUATION_COMMERCIAL_PROCESS, response: error.response })
                });
        })
    }
}