import axios from '../../../config/axios';
import * as monitoringBuyyerTypes from '../../constants/auction/monitoringBuyyerTypes';

export const getDetailAuctionMonitoringBuyyer = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auctions_proses/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_GET_DETAIL_MONITORING_BUYYER_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringBuyyerTypes.FAIL_GET_DETAIL_MONITORING_BUYYER_AUCTION, response: error.response })
                });
        })
    }
}
export const getTabulationAuctionMonitoringBuyyer = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auctions_proses/tabulation/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_GET_TABULATION_MONITORING_BUYYER_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringBuyyerTypes.FAIL_GET_TABULATION_MONITORING_BUYYER_AUCTION, response: error.response })
                });
        })
    }
}
export const getRangkingAuctionMonitoringBuyyer = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auctions_proses/ranking/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_GET_RANGKING_MONITORING_BUYYER_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringBuyyerTypes.FAIL_GET_RANGKING_MONITORING_BUYYER_AUCTION, response: error.response })
                });
        })
    }
}

export const storeCloseAuction = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/auctions_proses/close/'+id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_PUT_CLOSE_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringBuyyerTypes.FAIL_PUT_CLOSE_AUCTION, response: error.response })
                });
        })
    }
}

export const downloadBeritaAcara = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auctions_proses/download/'+id, {
                responseType : 'blob'
            })
                .then(response => {                    
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_GET_BERITA_ACARA_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringBuyyerTypes.FAIL_GET_BERITA_ACARA_AUCTION, response: error.response })
                });
        })
    }
}

export const storeBeritaAcara = (id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/auctions_proses/BA/'+id, payload)
                .then(response => {                    
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_STORE_BERITA_ACARA_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringBuyyerTypes.FAIL_STORE_BERITA_ACARA_AUCTION, response: error.response })
                });
        })
    }
}

export const editFreezeVendor = (id, vendor_id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('/tendering/auction_proses/freeze_vendor/'+id+'/'+vendor_id, payload)
                .then(response => {                    
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_EDIT_FREEZE_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringBuyyerTypes.FAIL_EDIT_FREEZE_VENDOR, response: error.response })
                });
        })
    }
}

export const getPanitiaAcara = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auction_proses/show_ba/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_GET_PANITIA_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringBuyyerTypes.FAIL_GET_PANITIA_AUCTION, response: error.response })
                });
        })
    }
}


export const AuctionBannedVendor = (id, vendor_id, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put(`/tendering/ban/${id}/${vendor_id}`, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_BANNED_VENDOR_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringBuyyerTypes.FAIL_BANNED_VENDOR_AUCTION, response: error.response })
                });
        })
    }
}

export const pauseResumeAuction = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/auction_proses/pause/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_PAUSE_RESUME_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringBuyyerTypes.FAIL_PAUSE_RESUME_AUCTION, response: error.response })
                });
        })
    }
}

export const stopAuction = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/auction_proses/stop/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_STOP_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringBuyyerTypes.FAIL_STOP_AUCTION, response: error.response })
                });
        })
    }
}

export const getPenawaranVendor = (id,vendor_id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/tendering/auctions_proses_bid/'+id+'/'+vendor_id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_GET_PENEWARAN_VENDOR_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringBuyyerTypes.FAIL_GET_PENEWARAN_VENDOR_AUCTION, response: error.response })
                });
        })
    }
}

export const storePenawaranVendor = (id, vendor_id ,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/auctions_proses_bid/'+id+'/'+vendor_id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_STORE_PENEWARAN_VENDOR_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringBuyyerTypes.FAIL_STORE_PENEWARAN_VENDOR_AUCTION, response: error.response })
                });
        })
    }
}
export const deleteVendorPenawaran = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('/tendering/auctions/peserta/'+id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringBuyyerTypes.SUCCESS_DELETE_VENDOR_PENAWARAN_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringBuyyerTypes.FAIL_DELETE_VENDOR_PENAWARAN_AUCTION, response: error.response })
                });
        })
    }
}