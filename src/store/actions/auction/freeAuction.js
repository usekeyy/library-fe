import axios from '../../../config/axios';
import * as freeAuctionType from '../../constants/auction/freeAuctionType';

export const storeFreeAuction = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/auction_create', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: freeAuctionType.SUCCESS_STORE_CREATE_FREE_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: freeAuctionType.FAIL_STORE_CREATE_FREE_AUCTION, response: error.response })
                });
        })
    }
}

export const storeItemFreeAuction = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/auction/items_free/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: freeAuctionType.SUCCESS_STORE_CREATE_ITEM_FREE_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: freeAuctionType.FAIL_STORE_CREATE_ITEM_FREE_AUCTION, response: error.response })
                });
        })
    }
}

export const putItemFreeAuction = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/auction/items_free/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: freeAuctionType.SUCCESS_PUT_ITEM_FREE_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: freeAuctionType.FAIL_PUT_ITEM_FREE_AUCTION, response: error.response })
                });
        })
    }
}

export const getOptionsVendorAuction = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auctions_search/'+id, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: freeAuctionType.SUCCESS_GET_VENDOR_OPTIONS_FREE_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: freeAuctionType.FAIL_GET_VENDOR_OPTIONS_FREE_AUCTION, response: error.response })
                });
        })
    }
}