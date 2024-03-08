import axios from '../../../config/axios';
import * as performanceVendorTypes from '../../constants/vendor/performanceReportTypes';

export const fetchPeformanceReport = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('book', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: performanceVendorTypes.SUCCESS_FETCH_PERFORMANCE_REPORT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: performanceVendorTypes.FAIL_FETCH_PERFORMANCE_REPORT, response: error.response })
                });
        })
    }
}

export const showDetailPerformanceReport = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('book/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: performanceVendorTypes.SUCCESS_SHOW_DETAIL_PERFORMANCE_REPORT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: performanceVendorTypes.FAIL_SHOW_DETAIL_PERFORMANCE_REPORT, response: error.response })
                });
        })
    }
}

export const syncVpr = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/sync_performance_report', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: performanceVendorTypes.SUCCESS_SYNC_VPR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: performanceVendorTypes.FAIL_SYNC_VPR, response: error.response })
                });
        })
    }
}

export const downloadExcelPerformanceReport = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/export_performance_report', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: performanceVendorTypes.SUCCESS_DOWNLOAD_VPR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: performanceVendorTypes.FAIL_DOWNLOAD_VPR, response: error.response })
                });
        })
    }
}

export const downloadVPR = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/export_detail_performance_report/'+uuid, {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: performanceVendorTypes.SUCCESS_DOWNLOAD_VPR_DETAIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: performanceVendorTypes.FAIL_DOWNLOAD_VPR_DETAIL, response: error.response })
                });
        })
    }
}

//SUPPLIER PERFORMANCE REPORT

export const fetchSupplierPeformanceReport = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/supplier_performance', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: performanceVendorTypes.SUCCESS_FETCH_SUPPLIER_PERFORMANCE_REPORT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: performanceVendorTypes.FAIL_FETCH_SUPPLIER_PERFORMANCE_REPORT, response: error.response })
                });
        })
    }
}

export const showDetailSupplierPerformanceReport = (id,purch_id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/vendor_management/supplier_performance/' + id + '/' +purch_id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: performanceVendorTypes.SUCCESS_SHOW_DETAIL_SUPPLIER_PERFORMANCE_REPORT,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: performanceVendorTypes.FAIL_SHOW_DETAIL_SUPPLIER_PERFORMANCE_REPORT, response: error.response })
                });
        })
    }
}

export const downloadExcelSupplierPerformanceReport = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/excel_supplier_performance', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: performanceVendorTypes.SUCCESS_DOWNLOAD_EXCEL_VPR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: performanceVendorTypes.FAIL_DOWNLOAD_EXCEL_VPR, response: error.response })
                });
        })
    }
}

export const downloadSupplierVPR = (uuid,purc_org_id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/pdf_supplier_performance/'+uuid+'/'+purc_org_id, {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: performanceVendorTypes.SUCCESS_DOWNLOAD_SUPPLIER_VPR_DETAIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: performanceVendorTypes.FAIL_DOWNLOAD_SUPPLIER_VPR_DETAIL, response: error.response })
                });
        })
    }
}
