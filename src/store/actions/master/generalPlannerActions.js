import axios from '../../../config/axios';
import * as generalPlannerTypes from '../../constants/generalPlannerTypes';

export const fetchGeneralPlanner = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('general_planner', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: generalPlannerTypes.SUCCESS_FETCH_GENERAL_PLANNER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: generalPlannerTypes.FAIL_FETCH_GENERAL_PLANNER, response: error.response })
                });
        })
    }
}

export const showGeneralPlanner = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('general_planner/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: generalPlannerTypes.SUCCESS_SHOW_GENERAL_PLANNER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: generalPlannerTypes.FAIL_SHOW_GENERAL_PLANNER, response: error.response })
                });
        })
    }
}

export const deleteGeneralPlanner = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('general_planner/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: generalPlannerTypes.SUCCESS_DELETE_GENERAL_PLANNER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: generalPlannerTypes.FAIL_DELETE_GENERAL_PLANNER, response: error.response })
                });
        })
    }
}

export const saveGeneralPlanner = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('general_planner', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: generalPlannerTypes.SUCCESS_SAVE_GENERAL_PLANNER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: generalPlannerTypes.FAIL_SAVE_GENERAL_PLANNER, response: error.response })
                });
        })
    }
}
export const updateGeneralPlanner = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('general_planner/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: generalPlannerTypes.SUCCESS_UPDATE_GENERAL_PLANNER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: generalPlannerTypes.FAIL_UPDATE_GENERAL_PLANNER, response: error.response })
                });
        })
    }
}