import axios from '../../../config/axios';
import * as auctionVendorTypes from '../../constants/auction/auctionVendorTypes';

export const fetchAuctionVendorList = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auction_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_FETCH_LIST_AUCTION_VENDOR,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: auctionVendorTypes.SUCCESS_FETCH_LIST_AUCTION_VENDOR, response: error.response })
                });
        })
    }
}

export const getDetailAuctionVendor = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auction_vendor/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_GET_DETAIL_AUCTION_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_GET_DETAIL_AUCTION_VENDOR, response: error.response })
                });
        })
    }
}

export const getBidDetailAuctionVendor = (id, vendor_id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auction_vendor/bid/'+id+'/'+vendor_id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_GET_BID_DETAIL_AUCTION_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_GET_BID_DETAIL_AUCTION_VENDOR, response: error.response })
                });
        })
    }
}

export const storeBidDetailAuctionVendor = (id, vendor_id, payload ) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/auction_vendor/bid/'+id+'/'+vendor_id, payload )
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_STORE_BID_DETAIL_AUCTION_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_STORE_BID_DETAIL_AUCTION_VENDOR, response: error.response })
                });
        })
    }
}

export const getTabulationAuctionVendor = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auction_vendor/tabulation/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_GET_BID_DETAIL_AUCTION_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_GET_BID_DETAIL_AUCTION_VENDOR, response: error.response })
                });
        })
    }
}

export const getRangkingAuctionVendor = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auction_vendor/ranking/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_GET_RANGKING_AUCTION_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_GET_RANGKING_AUCTION_VENDOR, response: error.response })
                });
        })
    }
}

export const getHistoryAuctionVendor = (id,pr_item, vendor_id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/tendering/auction_vendor/bid/history/${id}/${pr_item}/${vendor_id}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_GET_HISTORY_AUCTION_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_GET_HISTORY_AUCTION_VENDOR, response: error.response })
                });
        })
    }
}

export const storeAuctionVendorAggrement = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`/tendering/auction_vendor/agreement/${id}`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_STORE_AUCTION_VENDOR_AGGREMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_STORE_AUCTION_VENDOR_AGGREMENT, response: error.response })
                });
        })
    }
}

export const storeAuctionVendorFreeze = (id,vendor_id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`/tendering/auction_vendor/freeze/${id}/${vendor_id}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_STORE_VENDOR_FREEZE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_STORE_VENDOR_FREEZE, response: error.response })
                });
        })
    }
}

export const getDetailUpdateHarga = (id,vendor_id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/tendering/auction_vendor/update_harga/${id}/${vendor_id}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_GET_DETAIL_PRICE_UPDATED,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_GET_DETAIL_PRICE_UPDATED, response: error.response })
                });
        })
    }
}

export const storeDetailUpdateHarga = (id,vendor_id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`/tendering/auction_vendor/update_harga/${id}/${vendor_id}`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_STORE_PRICE_UPDATED,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_STORE_PRICE_UPDATED, response: error.response })
                });
        })
    }
}

export const getScoreVendor= (id,vendor_id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/tendering/auction_proses/score/${id}/${vendor_id}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionVendorTypes.SUCCESS_GET_SCORE_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionVendorTypes.FAIL_GET_SCORE_VENDOR, response: error.response })
                });
        })
    }
}