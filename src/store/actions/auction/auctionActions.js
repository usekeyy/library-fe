import axios from '../../../config/axios';
import * as auctionTypes from '../../constants/auction/auctionTypes';

export const fetchAuctionList = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auction', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_FETCH_LIST_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: auctionTypes.FAIL_FETCH_LIST_AUCTION, response: error.response })
                });
        })
    }
}

export const showDetailParameterAuction = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auction/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_SHOW_DETAIL_PARAMETER_ITEM_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionTypes.FAIL_SHOW_DETAIL_PARAMETER_ITEM_AUCTION, response: error.response })
                });
        })
    }
}
export const storeDetailAuction = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/auction/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_STORE_DETAIL_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionTypes.FAIL_STORE_DETAIL_AUCTION, response: error.response })
                });
        })
    }
}
export const updateItemAuction = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/auction/item/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_UPDATE_ITEM_DETAIL_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionTypes.FAIL_UPDATE_ITEM_DETAIL_AUCTION, response: error.response })
                });
        })
    }
}
export const storeScheduleItemAuction = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/auction/jadwal/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.FAIL_STORE_SCHEDULE_ITEM_DETAIL_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionTypes.FAIL_STORE_SCHEDULE_ITEM_DETAIL_AUCTION, response: error.response })
                });
        })
    }
}
export const publishAuction = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/auction/publish/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_STORE_PUBLISH_ITEM_DETAIL_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionTypes.FAIL_STORE_PUBLISH_ITEM_DETAIL_AUCTION, response: error.response })
                });
        })
    }
}
export const pesertaItemsAuction = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/auction/peserta/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_STORE_PESERTA_ITEM_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionTypes.FAIL_STORE_PESERTA_ITEM_AUCTION, response: error.response })
                });
        })
    }
}
export const historyItemsAuction = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auction/history/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_GET_HISTORY_ITEM_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionTypes.FAIL_GET_HISTORY_ITEM_AUCTION, response: error.response })
                });
        })
    }
}

export const getHistryVendorAuction = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auctions_proses/history_vendor/'+id, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_GET_HISTORY_VENDOR_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: auctionTypes.FAIL_GET_HISTORY_VENDOR_AUCTION, response: error.response })
                });
        })
    }
}


export const getHistoryTabulationItems = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auction_proses/history_item/'+id, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_GET_HISTORY_TABULATION_ITEM_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: auctionTypes.FAIL_GET_HISTORY_TABULATION_ITEM_AUCTION, response: error.response })
                });
        })
    }
}
export const getDocumentHistoryVendorAuction = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auctions_proses/history/'+id, {
                params: parameter,
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_GET_DOCUMENT_HISTORY_VENDOR_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: auctionTypes.FAIL_GET_DOCUMENT_HISTORY_VENDOR_AUCTION, response: error.response })
                });
        })
    }
}
export const getChatAuction = (id, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/tendering/auctions_proses/history_chat/${id}`, {
                params: parameter,
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_GET_HISTORY_CHAT_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: auctionTypes.FAIL_GET_HISTORY_CHAT_AUCTION, response: error.response })
                });
        })
    }
}

export const DeleteItemsFreeAuction = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/auction/items_free/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: auctionTypes.SUCCESS_DELETE_ITEM_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: auctionTypes.FAIL_DELETE_ITEM_AUCTION, response: error.response })
                });
        })
    }
}

export const fetchChat = (response) => {
	return dispatch => {
			if(response.type) {
					dispatch({ type: auctionTypes.SUCCESS_FETCH_CHAT_AUCTION, response: response.response });
			} else {
					dispatch({type: auctionTypes.FAIL_FETCH_CHAT_AUCTION});
			}
	}
}

export const appendChat = (response) => {
	return dispatch => {
			if(response.type) {
					dispatch({ type: auctionTypes.APPEND_CHAT_AUCTION, response: response.response });
			} else {
					dispatch({type: auctionTypes.FAIL_FETCH_CHAT_AUCTION});
			}
	}
}

export const unreadChatBuyer = (response) => {
	return dispatch => {
			if(response.type) {
					dispatch({ type: auctionTypes.UNREAD_CHAT_AUCTION_BUYER, response: true });
			} else {
					dispatch({type: auctionTypes.READ_CHAT_AUCTION_BUYER, response: false });
			}
	}
}

export const unreadChatVendor = (response) => {
	return dispatch => {
			if(response.type) {
					dispatch({ type: auctionTypes.UNREAD_CHAT_AUCTION_VENDOR, response: true });
			} else {
					dispatch({type: auctionTypes.READ_CHAT_AUCTION_VENDOR, response: false });
			}
	}
}

export const clearChatState = (response) => {
	return dispatch => {
			if(response.type) {
					dispatch({ type: auctionTypes.CLEAR_CHAT_AUCTION_VENDOR  });
				} else {
					dispatch({ type: auctionTypes.CLEAR_CHAT_AUCTION_VENDOR  });
			}
	}
}

export const onTyping = (response) => {
	return dispatch => {
			if(response.type) {
					dispatch({ type: auctionTypes.SUCCESS_TYPING_CHAT_AUCTION, response: response });
			} else {
					dispatch({type: auctionTypes.FAIL_TYPING_CHAT_AUCTION, response: null });
			}
	}
}


