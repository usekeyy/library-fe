import axios from '../../../config/axios';
import * as dashboardTypes from '../../constants/dashboard/dashboardTypes';

export const getTenderSummaryPOAccGroup = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/summary_po_acct', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_FETCH_SUMMARY_OF_PO_ACC_GROUP,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_FETCH_SUMMARY_OF_PO_ACC_GROUP, response: error.response })
                });
        })
    }
}

export const getTenderSummaryPOAccGroupDetail = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/summary_po_acct_detail', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_FETCH_SUMMARY_OF_PO_ACC_GROUP_DETAIL,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_FETCH_SUMMARY_OF_PO_ACC_GROUP_DETAIL, response: error.response })
                });
        })
    }
}

export const getTenderSummaryPO = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/summary_po', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_FETCH_SUMMARY_OF_PO,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_FETCH_SUMMARY_OF_PO, response: error.response })
                });
        })
    }
}

export const getTenderSummaryPODetail = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/summary_po_detail', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_FETCH_SUMMARY_DETAIL_OF_PO,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_FETCH_SUMMARY_DETAIL_OF_PO, response: error.response })
                });
        })
    }
}

export const getTenderPOAktifChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_po_aktif', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_PO_AKTIF_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_PO_AKTIF_CHART, response: error.response })
                });
        })
    }
}

export const getTenderPOAktifTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/po_aktif', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_PO_AKTIF_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_PO_AKTIF_TABLE, response: error.response })
                });
        })
    }
}

export const getTenderPOWorkflowChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_workflow_po', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_PO_WORKFLOW_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_PO_WORKFLOW_CHART, response: error.response })
                });
        })
    }
}

export const getTenderPOWorkflowTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/workflow_po', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_PO_WORKFLOW_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_PO_WORKFLOW_TABLE, response: error.response })
                });
        })
    }
}

export const getTenderPenerimaanPOChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_penerimaan_po', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_PENERIMAAN_PO_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_PENERIMAAN_PO_CHART, response: error.response })
                });
        })
    }
}

export const getTenderPenerimaanPOTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/penerimaan_po', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_PENERIMAAN_PO_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_PENERIMAAN_PO_TABLE, response: error.response })
                });
        })
    }
}

export const getTenderProcurementSavingChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_procurement_saving', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_PROCUREMENT_SAVING_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_PROCUREMENT_SAVING_CHART, response: error.response })
                });
        })
    }
}

export const getTenderProcurementSavingTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/procurement_saving', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_PROCUREMENT_SAVING_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_PROCUREMENT_SAVING_TABLE, response: error.response })
                });
        })
    }
}

export const getTenderProcurementLeadTimeTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/procurement_lead_time', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_PROCUREMENT_LEAD_TIME_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_PROCUREMENT_LEAD_TIME_TABLE, response: error.response })
                });
        })
    }
}

export const getTenderProcurementLeadTimeChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_procurement_lead_time', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_PROCUREMENT_LEAD_TIME_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_PROCUREMENT_LEAD_TIME_CHART, response: error.response })
                });
        })
    }
}

export const getSummaryEAuction = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/summary_auction', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_SUMMARY_E_AUCTION,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.SUCCESS_GET_SUMMARY_E_AUCTION, response: error.response })
                });
        })
    }
}

export const downloadExcelOpenOA = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_open_oa', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_OPEN_OA,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_OPEN_OA, response: error.response })
                });
        })
    }
}

export const downloadExcelPOAktif = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_po_aktif', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_PO_AKTIF,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_PO_AKTIF, response: error.response })
                });
        })
    }
}

export const downloadExcelPOWorkflow = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_workflow_po', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_PO_WORKFLOW,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_PO_WORKFLOW, response: error.response })
                });
        })
    }
}

export const downloadExcelPenerimaanPO = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_penerimaan_po', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_PENERIMAAN_PO,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_PENERIMAAN_PO, response: error.response })
                });
        })
    }
}

export const downloadExcelProcurementSaving = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_procurement_saving', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_PROCUREMENT_SAVING,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_PROCUREMENT_SAVING, response: error.response })
                });
        })
    }
}

export const downloadExcelProcurementLeadTime = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_procurement_lead_time', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_PROCUREMENT_LEAD_TIME,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_PROCUREMENT_LEAD_TIME, response: error.response })
                });
        })
    }
}

export const downloadExcelMRSRLeadTime = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/export_mrsr_lead_time', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_MRSR_LEAD_TIME,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_MRSR_LEAD_TIME, response: error.response })
                });
        })
    }
}

export const getTenderSummarySourcePOChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/count_summary_source_po', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_TENDER_SUMMARY_SOURCE_PO_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_TENDER_SUMMARY_SOURCE_PO_CHART, response: error.response })
                });
        })
    }
}

export const downloadExcelSummaryAuction = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_summary_auction', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_SUMMARY_AUCTION,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_SUMMARY_AUCTION, response: error.response })
                });
        })
    }
}

export const downloadExcelSummarySourcePO = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_summary_source_po', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_SUMMARY_SOURCE_PO,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_SUMMARY_SOURCE_PO, response: error.response })
                });
        })
    }
}

export const downloadExcelRealisasiPO = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_realisasi_po_acct', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_REALISASI_PO,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_REALISASI_PO, response: error.response })
                });
        })
    }
}

export const getProcurementSavingPerCompany = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/proc_saving_company', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_FETCH_PROCUREMENT_SAVING_PER_COMPANY,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_FETCH_PROCUREMENT_SAVING_PER_COMPANY, response: error.response })
                });
        })
    }
}