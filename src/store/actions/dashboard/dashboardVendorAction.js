import axios from '../../../config/axios';
import * as dashboardTypes from '../../constants/dashboard/dashboardTypes';

export const getVendorStatusChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_status_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_VENDOR_STATUS_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_VENDOR_STATUS_CHART, response: error.response })
                });
        })
    }
}

export const getVendorPerformaChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_performa_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_VENDOR_PERFORMA_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_VENDOR_PERFORMA_CHART, response: error.response })
                });
        })
    }
}

export const getVendorAktifChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_vendor_aktif', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_VENDOR_AKTIF_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_VENDOR_AKTIF_CHART, response: error.response })
                });
        })
    }
}

export const getVendorStatusTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/report_vendor_sos', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_VENDOR_STATUS_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_VENDOR_STATUS_TABLE, response: error.response })
                });
        })
    }
}

export const getVendorAktifTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/vendor_aktif', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_VENDOR_AKTIF_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_VENDOR_AKTIF_TABLE, response: error.response })
                });
        })
    }
}

export const getTenderOpenOaChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_open_oa', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_OPEN_OA_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_OPEN_OA_CHART, response: error.response })
                });
        })
    }
}

export const getTenderOpenOaTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/open_oa', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_OPEN_OA_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_OPEN_OA_TABLE, response: error.response })
                });
        })
    }
}

export const getMrsrLeadTimeChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_mrsr_lead_time', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_MRSR_LEAD_TIME_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_MRSR_LEAD_TIME_CHART, response: error.response })
                });
        })
    }
}

export const getMrsrLeadTimeTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/mrsr_lead_time', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_MRSR_LEAD_TIME_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_MRSR_LEAD_TIME_TABLE, response: error.response })
                });
        })
    }
}

export const getMrsr = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/report_mrsr', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_MRSR_A,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_MRSR_A, response: error.response })
                });
        })
    }
}

export const downloadMrsr = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_report_mrsr', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_MRSR_A,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_MRSR_A, response: error.response })
                });
        })
    }
}

export const getVendorVprRfqTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/vendor_rfq', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_VENDOR_VPR_RFQ_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_VENDOR_VPR_RFQ_TABLE, response: error.response })
                });
        })
    }
}

export const downloadExcelStatusVendor = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_status_vendor', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_STATUS_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_STATUS_VENDOR, response: error.response })
                });
        })
    }
}

export const downloadExcelVendorAktif = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_vendor_aktif', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_VENDOR_AKTIF,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_VENDOR_AKTIF, response: error.response })
                });
        })
    }
}

export const downloadExcelVendorRFQ = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_vendor_rfq', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_VENDOR_RFQ,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_VENDOR_RFQ, response: error.response })
                });
        })
    }
}

export const downloadExcelReportSOS = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_report_sos', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_REPORT_SOS,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_REPORT_SOS, response: error.response })
                });
        })
    }
}