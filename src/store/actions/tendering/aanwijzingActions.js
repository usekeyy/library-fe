import axios from '../../../config/axios';
import * as aanwijzingTypes from '../../constants/tendering/aanwijzingTypes';

export const fetchAanwijzingList = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/aanwijzing', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_FETCH_AANWIJZING,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: aanwijzingTypes.FAIL_FETCH_AANWIJZING, response: error.response })
                });
        })
    }
}

export const fetchAanwijzingListCreate = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/aanwijzing_available_tender', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_FETCH_GET_AANWIJZING_LIST_CREATE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: aanwijzingTypes.FAIL_FETCH_GET_AANWIJZING_LIST_CREATE, response: error.response })
                });
        })
    }
}

export const showAanwijzingDetail = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/aanwijzing_detail/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_SHOW_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_SHOW_AANWIJZING, response: error.response })
                });
        })
    }
}

export const taskAanwijzing = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/aanwijzing_list_task/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_TASK_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_TASK_AANWIJZING, response: error.response })
                });
        })
    }
}

export const registrationAanwijzing = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/registrasi_aanwijzing/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_REGISTRATION_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_REGISTRATION_AANWIJZING, response: error.response })
                });
        })
    }
}

export const storeUploadAanwijzing = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/aanwijzing_attachment/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_STORE_UPLOAD_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_STORE_UPLOAD_AANWIJZING, response: error.response })
                });
        })
    }
}

export const storeAanwijzingConfig = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/aanwijzing_config', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_STORE_AANWIJZING_CONFIG,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_STORE_AANWIJZING_CONFIG, response: error.response })
                });
        })
    }
}

export const putAanwijzingConfig = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/aanwijzing_config/'+id , payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_PUT_AANWIJZING_CONFIG,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_PUT_AANWIJZING_CONFIG, response: error.response })
                });
        })
    }
}

export const showAanwijzingQuestion = (aanwijzing_uuid,id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/aanwijzing_question/'+aanwijzing_uuid+'/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_QUESTION_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_QUESTION_AANWIJZING, response: error.response })
                });
        })
    }
}

export const closeAanwijzing = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/aanwijzing_close/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_AANWIJZING_CLOSE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_AANWIJZING_CLOSE, response: error.response })
                });
        })
    }
}

export const storeNoteAanwijzing = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/aanwijzing_note/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_STORE_NOTE_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_STORE_NOTE_AANWIJZING, response: error.response })
                });
        })
    }
}

export const storeNoteAanwijzingCreate = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/aanwijzing_note', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_STORE_AANWIJZING_CREATE_NOTE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_STORE_AANWIJZING_CREATE_NOTE, response: error.response })
                });
        })
    }
}

export const storeAanwijzingQuestion = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/aanwijzing_question', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_QUESTION_AANWIJZING_CREATE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_QUESTION_AANWIJZING_CREATE, response: error.response })
                });
        })
    }
}

export const storeAanwijzingSummary = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/aanwijzing_summary/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_AANWIJZING_SUMMARY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_AANWIJZING_SUMMARY, response: error.response })
                });
        })
    }
}

export const updateAanwijzingQuestion = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/aanwijzing_question-detail/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_UPDATE_MESSAGE_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_UPDATE_MESSAGE_AANWIJZING, response: error.response })
                });
        })
    }
}

export const deleteAanwijzingQuestion = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/aanwijzing_question-delete/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_DELETE_MESSAGE_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_DELETE_MESSAGE_AANWIJZING, response: error.response })
                });
        })
    }
}

export const fetchAanwijzingSAPVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/aanwijzing_sap/vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_FFETCH_AANWIJZING_SAP_VENDOR,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: aanwijzingTypes.FAIL_FETCH_AANWIJZING_SAP_VENDOR, response: error.response })
                });
        })
    }
}

export const saveAanwijzingSAP = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/aanwijzing_sap', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_SAVE_AANWIJZING_SAP,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_SAVE_AANWIJZING_SAP, response: error.response })
                });
        })
    }
}

export const getAanwijzingHistory= (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/aanwijzing_history/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_GET_AANWIJZING_HISTORY,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: aanwijzingTypes.FAIL_GET_AANWIJZING_HISTORY, response: error.response })
                });
        })
    }
}

export const downloadBeritaAcaraAanwijzing = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/aanwijzing/${uuid}/preview_ba`, {
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_DOWNLOAD_BERITA_ACARA_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_DOWNLOAD_BERITA_ACARA_AANWIJZING, response: error.response })
                });
        })
    }
}

export const getAanwijzinglistUpload = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/aanwijzing_attachment/${uuid}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_GET_UPLOAD_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    console.log(error.response)
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_GET_UPLOAD_AANWIJZING, response: error.response })
                });
        })
    }
}

export const deleteAanwijzingUpload = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/aanwijzing_attachment/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: aanwijzingTypes.SUCCESS_DELETE_UPLOAD_AANWIJZING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: aanwijzingTypes.FAIL_DELETE_UPLOAD_AANWIJZING, response: error.response })
                });
        })
    }
}



