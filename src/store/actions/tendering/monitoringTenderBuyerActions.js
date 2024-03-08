import axios from '../../../config/axios';
import * as monitoringTypes from '../../constants/tendering/monitoringTenderBuyerTypes';

export const downloadMonitoringTenderBuyer = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/tendering/cetak_monitoring_tender_buyer`, {
                params: parameter,
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_DOWNLOAD_MONITORING_TENDER_BUYER_DETAIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_DOWNLOAD_MONITORING_TENDER_BUYER_DETAIL, response: error.response })
                });
        })
    }
}

export const fetchMonitoringTenderBuyer = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('	tendering/monitoring_tender_buyer', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_FETCH_MONITORING_TENDER_BUYER,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringTypes.FAIL_FETCH_MONITORING_TENDER_BUYER, response: error.response })
                });
        })
    }
}


export const showMonitoringTenderBuyerDetail = (uuid, payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/monitoring_tender_buyer/' + uuid, {
                params: payload
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_FETCH_MONITORING_TENDER_BUYER_DETAIL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringTypes.FAIL_FETCH_MONITORING_TENDER_BUYER_DETAIL, response: error.response })
                });
        })
    }
}

export const showVendorPanel = (uuid,parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/list_vendor_monitoring_tender_buyer/' + uuid, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_SHOW_VENDOR_PANEL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringTypes.FAIL_SHOW_VENDOR_PANEL, response: error.response })
                });
        })
    }
}

export const updateDokumenPengadaan = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/update_dokumen_pengadaan_monitoring', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_UPDATE_DOKUMEN_PENGADAAN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_UPDATE_DOKUMEN_PENGADAAN, response: error.response })
                });
        })
    }
}

export const updateProposalTenderJadwal = (uuid,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/update_jadwal_tender_monitoring/' + uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_UPDATE_PROPOSAL_TENDER_JADWAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_UPDATE_PROPOSAL_TENDER_JADWAL, response: error.response })
                });
        })
    }
}

export const fetchJadwalTender = (uuid,parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/list_history_jadwal_monitoring_tender_buyer/'+uuid, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_FETCH_HISTORY_JADWAL_TENDER,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringTypes.FAIL_FETCH_HISTORY_JADWAL_TENDER, response: error.response })
                });
        })
    }
}

export const downloadAwardingBeritaAcara = (uuid,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/proposal_tender/detail/pengumuman_pemenang/'+uuid, payload, {
                responseType : 'blob'
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_DOWNLOAD_AWARDING_BERITA_ACARA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_DOWNLOAD_AWARDING_BERITA_ACARA, response: error.response })
                });
        })
    }
}
export const downloadBeritaAcaraPO = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/purchase_order_generate_dokumen/'+uuid, {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_DOWNLOAD_PO_BERITA_ACARA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_DOWNLOAD_PO_BERITA_ACARA, response: error.response })
                });
        })
    }
}

export const downloadMonitoringTender = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/cetak_monitoring_tender_buyer/'+uuid, {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_DOWNLOAD_MONITORING_TENDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_DOWNLOAD_MONITORING_TENDER, response: error.response })
                });
        })
    }
}

export const fetchArsipTender = (uuid,parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/arsip_tender_monitoring/'+uuid, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_FETCH_ARSIP_TENDER_MONITORING,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: monitoringTypes.FAIL_FETCH_ARSIP_TENDER_MONITORING, response: error.response })
                });
        })
    }
}

export const saveArsipTender = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/arsip_tender_monitoring', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_SAVE_ARSIP_TENDER_MONITORING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_SAVE_ARSIP_TENDER_MONITORING, response: error.response })
                });
        })
    }
}

export const deleteArsipTender = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/arsip_tender_monitoring/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_DELETE_ARSIP_TENDER_MONITORING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_DELETE_ARSIP_TENDER_MONITORING, response: error.response })
                });
        })
    }
}

export const downloadRFQ = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/proposal_tender/cetak_rfq/'+uuid, {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_DOWNLOAD_RFQ,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_DOWNLOAD_RFQ, response: error.response })
                });
        })
    }
}

export const downloadPaktaIntegritasTender = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/proposal_tender/cetak_pakta_integritas/'+uuid, {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_DOWNLOAD_PAKTA_INTEGRITAS_TENDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_DOWNLOAD_PAKTA_INTEGRITAS_TENDER, response: error.response })
                });
        })
    }
}

export const showPOOutstanding = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/purchase_order_outstanding', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_SHOW_PO_OUTSTANDING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.FAIL_SHOW_PO_OUTSTANDING, response: error.response })
                });
        })
    }
}

export const submitExtendJadwal = (uuid,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/extend_jadwal_monitoring/'+uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_SUBMIT_EXTEND_JADWAL_MONITORING_TENDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.SUCCESS_SUBMIT_EXTEND_JADWAL_MONITORING_TENDER, response: error.response })
                });
        })
    }
}

export const approveExtendJadwal = (uuid,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('/tendering/approve_extend_jadwal/'+uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: monitoringTypes.SUCCESS_APPROVE_EXTEND_JADWAL_MONITORING_TENDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: monitoringTypes.SUCCESS_APPROVE_EXTEND_JADWAL_MONITORING_TENDER, response: error.response })
                });
        })
    }
}