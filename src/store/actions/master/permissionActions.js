import axios from '../../../config/axios';
import * as permissionTypes from '../../constants/permissionTypes';

export const fetchPermission = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('permission', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: permissionTypes.SUCCESS_FETCH_PERMISSION,
                        data: response.data
                    })
                })
                .catch(error => {
                    const response = typeof (error.response !== 'object') ? {} : error.response;
                    reject(response);
                    dispatch({ type: permissionTypes.FAIL_FETCH_PERMISSION, response: response })
                });
        })
    }
}