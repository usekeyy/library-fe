import axios from '../../../config/axios';
import * as metodeAanwijzingTypes from '../../constants/metodeAanwijzingTypes';

export const fetchMetodeAanwijzing = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/metode_aanwijzing', {
                params: parameter
            })
						.then(response => {
								resolve(response);
								dispatch({
										type: metodeAanwijzingTypes.SUCCESS_FETCH_METODE_AANWIJZING,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodeAanwijzingTypes.FAIL_FETCH_METODE_AANWIJZING, response: error.response })
						});
        })
    }
}

export const showMetodeAanwijzing = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('tendering/metode_aanwijzing/' + id)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodeAanwijzingTypes.SUCCESS_SHOW_METODE_AANWIJZING,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodeAanwijzingTypes.FAIL_SHOW_METODE_AANWIJZING, response: error.response })
						});
        })
    }
}

export const deleteMetodeAanwijzing = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('tendering/metode_aanwijzing/' + id)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodeAanwijzingTypes.SUCCESS_DELETE_METODE_AANWIJZING,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodeAanwijzingTypes.FAIL_DELETE_METODE_AANWIJZING, response: error.response })
						});
        })
    }
}

export const saveMetodeAanwijzing = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('tendering/metode_aanwijzing', payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodeAanwijzingTypes.SUCCESS_SAVE_METODE_AANWIJZING,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodeAanwijzingTypes.FAIL_SAVE_METODE_AANWIJZING, response: error.response })
						});
        })
    }
}
export const updateMetodeAanwijzing = (id,payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('tendering/metode_aanwijzing/' + id, payload)
						.then(response => {
								resolve(response);
								dispatch({
										type: metodeAanwijzingTypes.SUCCESS_UPDATE_METODE_AANWIJZING,
										data: response.data
								})
						})
						.catch(error => {
								reject(error.response);
								dispatch({ type: metodeAanwijzingTypes.FAIL_UPDATE_METODE_AANWIJZING, response: error.response })
						});
        })
    }
}