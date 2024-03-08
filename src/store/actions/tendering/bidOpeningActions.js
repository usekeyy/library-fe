import axios from '../../../config/axios';
import * as bidOpeningTypes from '../../constants/tendering/bidOpeningTypes';

export const fetchBidOpening = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/bid-opening', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_FETCH_BID_OPENING,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: bidOpeningTypes.FAIL_FETCH_BID_OPENING, response: error.response })
                });
        })
    }
}

export const showBidOpening = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/bid_opening_detail/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_SHOW_BID_OPENING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_SHOW_BID_OPENING, response: error.response })
                });
        })
    }
}

export const downloadBidOpening = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/bid-opening-bapp/'+id,{
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_GET_BAPP_COMMERCIAL_BID_OPENING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_GET_BAPP_COMMERCIAL_BID_OPENING, response: error.response })
                });
        })
    }
}

export const showNoteBidOpening = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/bid-opening-note/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_SHOW_NOTE_BID_OPENING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_SHOW_NOTE_BID_OPENING, response: error.response })
                });
        })
    }
}

export const reTenderBidOpening = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/bid-opening-retender/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_SHOW_REJECT_BID_OPENING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_SHOW_REJECT_BID_OPENING, response: error.response })
                });
        })
    }
}
export const publishBidOpening = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/publish-bapp/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_PUBLISH_BID_OPENING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_PUBLISH_BID_OPENING, response: error.response })
                });
        })
    }
}
export const openBidOpening = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/bid-opening-open/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_OPEN_BID_OPENING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_OPEN_BID_OPENING, response: error.response })
                });
        })
    }
}

export const S2BidOpening = (id,type) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/bid-opening/'+type+'/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_OPEN_BID_OPENING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_OPEN_BID_OPENING, response: error.response })
                });
        })
    }
}

export const DetailBidOpeningTechnical = (uuid,vendor_uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/bid_opening_detail_technical/'+uuid+'/'+vendor_uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_GET_DETAIL_TECHNICAL_BID_OPENING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_GET_DETAIL_TECHNICAL_BID_OPENING, response: error.response })
                });
        })
    }
}

export const DetailBidOpeningCommersial = (uuid,vendor_uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/bid_opening_detail_komersil/'+uuid+'/'+vendor_uuid,{
                params : payload
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_GET_DETAIL_COMMERCIAL_BID_OPENING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_GET_DETAIL_COMMERCIAL_BID_OPENING, response: error.response })
                });
        })
    }
}

export const storeNoteBidOpening = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/bid-opening',payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_STORE_NOTE_BID_OPENING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_STORE_NOTE_BID_OPENING, response: error.response })
                });
        })
    }
}

export const downloadBidOpeningBidTabulation = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/proposal_tender/${uuid}/generate_bid_tabulation`, {
                responseType : 'blob'
            })
                .then(response => {
                    // console.log(response)
                    resolve(response);
                    dispatch({
                        type: bidOpeningTypes.SUCCESS_DOWNLOAD_BID_OPENING_BID_TABULATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: bidOpeningTypes.FAIL_DOWNLOAD_BID_OPENING_BID_TABULATION, response: error.response })
                });
        })
    }
}