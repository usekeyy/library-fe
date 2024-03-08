import axios from '../../../config/axios';
import * as masterTemplateLOA from '../../constants/masterTemplateLOA';

export const fetchEDocument = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('master_template_oa', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterTemplateLOA.SUCCESS_FETCH_MASTER_TEMPLATE_LOA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterTemplateLOA.FAIL_FETCH_MASTER_TEMPLATE_LOA, response: error.response })
                });
        })
    }
}

export const showEDocument = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('master_template_oa/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterTemplateLOA.SUCCESS_SHOW_MASTER_TEMPLATE_LOA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterTemplateLOA.FAIL_SHOW_MASTER_TEMPLATE_LOA, response: error.response })
                });
        })
    }
}

export const deleteEDocument = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('master_template_oa/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterTemplateLOA.SUCCESS_DELETE_MASTER_TEMPLATE_LOA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterTemplateLOA.FAIL_DELETE_MASTER_TEMPLATE_LOA, response: error.response })
                });
        })
    }
}

export const saveEDocument = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('master_template_oa', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterTemplateLOA.SUCCESS_SAVE_MASTER_TEMPLATE_LOA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterTemplateLOA.FAIL_SAVE_MASTER_TEMPLATE_LOA, response: error.response })
                });
        })
    }
}
export const updateEDocument = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('master_template_oa/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: masterTemplateLOA.SUCCESS_UPDATE_MASTER_TEMPLATE_LOA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: masterTemplateLOA.FAIL_UPDATE_MASTER_TEMPLATE_LOA, response: error.response })
                });
        })
    }
}