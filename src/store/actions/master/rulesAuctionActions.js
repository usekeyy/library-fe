import axios from '../../../config/axios';
import * as rulesAuctionTypes from '../../constants/rulesAuctionTypes';

export const fetchAssetsRulesAuctions = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/master_rule_auction', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: rulesAuctionTypes.SUCCESS_GET_FETCH_RULES_AUCTIONS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: rulesAuctionTypes.FAIL_GET_FETCH_RULES_AUCTIONS, response: error.response })
                });
        })
    }
}

export const getDetailRulesAuction = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/master_rule_auction/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: rulesAuctionTypes.SUCCESS_GET_DETAIL_RULES_AUCTIONS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: rulesAuctionTypes.FAIL_GET_DETAIL_RULES_AUCTIONS, response: error.response })
                });
        })
    }
}

export const storeRulesAuction = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/master_rule_auction', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: rulesAuctionTypes.SUCCESS_STORE_RULES_AUCTIONS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: rulesAuctionTypes.FAIL_STORE_RULES_AUCTIONS, response: error.response })
                });
        })
    }
}

export const updateRulesAuction = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/master_rule_auction/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: rulesAuctionTypes.SUCCESS_UPDATE_RULES_AUCTIONS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: rulesAuctionTypes.FAIL_UPDATE_RULES_AUCTIONS, response: error.response })
                });
        })
    }
}

export const deleteRulesAuction = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/master_rule_auction/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: rulesAuctionTypes.SUCCESS_DELETE_RULES_AUCTIONS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: rulesAuctionTypes.FAIL_DELETE_RULES_AUCTIONS, response: error.response })
                });
        })
    }
}