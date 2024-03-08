import axios from '../../../config/axios';
import * as dashboardTypes from '../../constants/dashboard/dashboardTypes';

export const getStatusInvoiceChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_status_invoice', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_STATUS_INVOICE_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_STATUS_INVOICE_CHART, response: error.response })
                });
        })
    }
}

export const getStatusInvoiceTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/status_invoice', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_STATUS_INVOICE_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_STATUS_INVOICE_TABLE, response: error.response })
                });
        })
    }
}

export const downloadExcelStatusInvoice = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/export_status_invoice', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_STATUS_INVOICE,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_STATUS_INVOICE, response: error.response })
                });
        })
    }
}

export const getPaymentLeadTimeChart = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/count_payment_lead_time', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_PAYMENT_LEAD_TIME_CHART,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_PAYMENT_LEAD_TIME_CHART, response: error.response })
                });
        })
    }
}

export const getPaymentLeadTimeTable = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('/dashboard/payment_lead_time', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_GET_PAYMENT_LEAD_TIME_TABLE,
                        data: response.data                      
                    })
                })
                .catch(error => {
                   reject(error.response);
                   dispatch({ type: dashboardTypes.FAIL_GET_PAYMENT_LEAD_TIME_TABLE, response: error.response })
                });
        })
    }
}

export const downloadExcelPaymentLeadTime = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('dashboard/excel_invoice_payment_lead_time', {
                responseType : 'blob'
            })
                .then(response => {
                    console.log(response)
                    resolve(response);
                    dispatch({
                        type: dashboardTypes.SUCCESS_DOWNLOAD_PAYMENT_LEAD_TIME,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: dashboardTypes.FAIL_DOWNLOAD_PAYMENT_LEAD_TIME, response: error.response })
                });
        })
    }
}






