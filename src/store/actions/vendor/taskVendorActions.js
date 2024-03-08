import axios from '../../../config/axios';
import * as currenciesType from '../../constants/vendor/taskVendorTypes';

export const countTaskProposalTender = (vendor_uuid, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/proposal_tender/vendor/${vendor_uuid}/count`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_TASK_PROPOSAL_TENDER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_TASK_PROPOSAL_TENDER, response: error.response })
                });
        })
    }
}

export const countTaskProposalTenderAktif = (vendor_uuid, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/proposal_tender/tender_aktif/${vendor_uuid}/agg`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_TASK_PROPOSAL_TENDER_AKTIF,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_TASK_PROPOSAL_TENDER_AKTIF, response: error.response })
                });
        })
    }
}

export const countTaskQuotation = (vendor_uuid, parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/proposal_tender/vendor_quotation/${vendor_uuid}/agg`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_TASK_QUOTATION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_TASK_QUOTATION, response: error.response })
                });
        })
    }
}

export const countTaskEvaluasiAdmin = (vendor_uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/evaluasi_admin_task/${vendor_uuid}`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_EVALUASI_ADMIN,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_EVALUASI_ADMIN, response: error.response })
                });
        })
    }
}

export const countTaskEvaluasiTeknis = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/evaluasi_teknis/task/teknis`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_EVALUASI_TEKNIS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_EVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}

export const countTaskEvaluasiTeknisAssignment = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/evaluasi_teknis/task/assignment`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_EVALUASI_TEKNIS_ASSIGNMENT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_EVALUASI_TEKNIS_ASSIGNMENT, response: error.response })
                });
        })
    }
}

export const countTaskEvaluasiKomersil = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/evaluasi_komersil_task`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_EVALUASI_KOMERSIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_EVALUASI_KOMERSIL, response: error.response })
                });
        })
    }
}


export const countTaskPenawaranTerkirim = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/proposal_tender/penawaran_terkirim/agg`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_PENAWARAN_TERKIRIM,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_PENAWARAN_TERKIRIM, response: error.response })
                });
        })
    }
}

export const countTaskKlarifikasiEvaluasiTeknis = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/evaluasi_teknis_klarifikasi_task`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_KLARIFIKASI_EVALUASI_TEKNIS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_KLARIFIKASI_EVALUASI_TEKNIS, response: error.response })
                });
        })
    }
}

export const countTaskRejectExtendCompany = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/reject_extend_company/`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_REJECT_EXTEND_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_REJECT_EXTEND_COMPANY, response: error.response })
                });
        })
    }
}

export const countTaskRejectDataProfil = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/reject_profil/agg`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_REJECT_DATA_PROFIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_REJECT_DATA_PROFIL, response: error.response })
                });
        })
    }
}

export const getCountDokumenExpired = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`vendor_management/expired_document/${uuid}/agg`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_DOKUMEN_EXPIRED,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_DOKUMEN_EXPIRED, response: error.response })
                });
        })
    }
}

export const getCountAuctionVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`tendering/task_auction`,{
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_TASK_AUCTION_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_TASK_AUCTION_VENDOR, response: error.response })
                });
        })
    }
}


//INVOICE
export const countUnbilledBarang = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/invoice/unbilled/task/1`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_TASK_UNBILLED_BARANG,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_TASK_UNBILLED_BARANG, response: error.response })
                });
        })
    }
}

export const countUnbilledJasa = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get(`/invoice/unbilled/task/9`, {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_COUNT_TASK_UNBILLED_JASA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_COUNT_TASK_UNBILLED_JASA, response: error.response })
                });
        })
    }
}




