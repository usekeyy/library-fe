import axios from '../../../config/axios';
import * as migrasiVendorTypes from '../../constants/vendor/migrasiVendorTypes';

export const fetchMigrasiVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sheet_vendors', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_FETCH_MIGRASI_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_FETCH_MIGRASI_VENDOR, response: error.response })
                });
        })
    }
}

export const fetchMigrasiExtendCompany = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sheet_extend_company', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_FETCH_MIGRASI_EXTEND_COMPANY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_FETCH_MIGRASI_EXTEND_COMPANY, response: error.response })
                });
        })
    }
}

export const fetchMigrasiVendorPic = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sheet_vendor_pic', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_FETCH_MIGRASI_VENDOR_PIC,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_FETCH_MIGRASI_VENDOR_PIC, response: error.response })
                });
        })
    }
}

export const fetchMigrasiSiujk = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sheet_vendor_siujk', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_FETCH_MIGRASI_SIUJK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_FETCH_MIGRASI_SIUJK, response: error.response })
                });
        })
    }
}

export const fetchMigrasiSil = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sheet_vendor_lain', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_FETCH_MIGRASI_SIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_FETCH_MIGRASI_SIL, response: error.response })
                });
        })
    }
}

export const fetchMigrasiPajakFiskal = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sheet_vendor_fiskal', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_FETCH_MIGRASI_PAJAK_FISKAL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_FETCH_MIGRASI_PAJAK_FISKAL, response: error.response })
                });
        })
    }
}

export const fetchMigrasiKompetensiVendor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sheet_kompetensi_vendor', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_FETCH_MIGRASI_KOMPETENSI_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_FETCH_MIGRASI_KOMPETENSI_VENDOR, response: error.response })
                });
        })
    }
}

export const fetchMigrasiRekeningBank = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sheet_rekening_bank', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_FETCH_MIGRASI_REKENING_BANK,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_FETCH_MIGRASI_REKENING_BANK, response: error.response })
                });
        })
    }
}

export const saveMigrasiVendor = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post(`vendor_management/migrate_vendor`)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_SAVE_MIGRASI_VENDOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.SUCCESS_SAVE_MIGRASI_VENDOR, response: error.response })
                });
        })
    }
}

export const fetchMigrasiLog = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/migration_vendor_log', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_FETCH_MIGRASI_LOG,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_FETCH_MIGRASI_LOG, response: error.response })
                });
        })
    }
}

export const fetchVendorHistory = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/sheet_vendors/agg', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_FETCH_MIGRASI_VENDOR_HISTORY,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_FETCH_MIGRASI_VENDOR_HISTORY, response: error.response })
                });
        })
    }
}

export const resendEmailMigrasi = (uuid) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('vendor_management/resend_email_migration/' + uuid)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_MIGRASI_RESEND_EMAIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_MIGRASI_RESEND_EMAIL, response: error.response })
                });
        })
    }
}

export const updateEmailMigrasi = (uuid,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('vendor_management/update_email_migration/' + uuid, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: migrasiVendorTypes.SUCCESS_MIGRASI_UPDATE_EMAIL,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: migrasiVendorTypes.FAIL_MIGRASI_UPDATE_EMAIL, response: error.response })
                });
        })
    }
}

export const saveSimap = (payload) => {
	return dispatch => {
			return new Promise((resolve, reject) => {
					axios.post(`/vendor_management/upload_simap`, payload)
					.then(res => {
							resolve(res)
							const response = res.data;
							dispatch({
									type: migrasiVendorTypes.SUCCESS_SUBMIT_SIMAP,
									data: response.data,
									response: response
							})
					})
					.catch(error => {
							reject(error.response);
							const response = (typeof error.response !== 'object') ? {} : error.response;
							dispatch({type: migrasiVendorTypes.FAIL_SUBMIT_SIMAP, response: response})
					})
			})   
	}
}

