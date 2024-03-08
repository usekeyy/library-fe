import axios from '../../../config/axios';
import * as awardingTypes from '../../constants/tendering/awardingTypes';

export const fetchAwarding = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/awarding', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: awardingTypes.SUCCESS_FETCH_AWARDING,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: awardingTypes.FAIL_FETCH_AWARDING, response: error.response })
                });
        })
    }
}

export const showAwarding = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/awarding/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: awardingTypes.SUCCESS_SHOW_AWARDING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: awardingTypes.FAIL_SHOW_AWARDING, response: error.response })
                });
        })
    }
}

export const saveAwarding = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/awarding/', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: awardingTypes.SUCCESS_SUBMIT_AWARDING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: awardingTypes.FAIL_SUBMIT_AWARDING, response: error.response })
                });
        })
    }
}

export const approveAwarding = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/awarding/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: awardingTypes.SUCCESS_APPROVAL_AWARDING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: awardingTypes.FAIL_APPROVAL_AWARDING, response: error.response })
                });
        })
    }
}

export const reNegoAwarding = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/awarding_renego/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: awardingTypes.SUCCESS_RE_NEGO_AWARDING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: awardingTypes.FAIL_RE_NEGO_AWARDING, response: error.response })
                });
        })
    }
}

export const fetchLampiranAwarding = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/awarding_lampiran', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: awardingTypes.SUCCESS_FETCH_LAMPIRAN_AWARDING,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: awardingTypes.FAIL_FETCH_LAMPIRAN_AWARDING, response: error.response })
                });
        })
    }
}

export const publishAwarding = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/awarding_publish/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: awardingTypes.SUCCESS_APPROVAL_AWARDING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: awardingTypes.FAIL_APPROVAL_AWARDING, response: error.response })
                });
        })
    }
}
