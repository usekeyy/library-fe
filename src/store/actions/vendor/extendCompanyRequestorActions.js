import axios from '../../../config/axios';
import * as currenciesType from '../../constants/vendor/extendCompanyRequestorTypes';

export const fetchExtendCompanyRequestor = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('vendor_management/ajuan_extend_company_requestor/', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: currenciesType.SUCCESS_FETCH_EXTEND_COMPANY_REQUESTOR,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: currenciesType.FAIL_FETCH_EXTEND_COMPANY_REQUESTOR, response: error.response })
                });
        })
    }
}
