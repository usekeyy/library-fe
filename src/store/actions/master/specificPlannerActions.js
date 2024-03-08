import axios from '../../../config/axios';
import * as specificPlannerTypes from '../../constants/specificPlannerTypes';

export const fetchSpecificPlanner = (parameter) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('specific_planner', {
                params: parameter
            })
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: specificPlannerTypes.SUCCESS_FETCH_SPECIFIC_PLANNER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: specificPlannerTypes.FAIL_FETCH_SPECIFIC_PLANNER, response: error.response })
                });
        })
    }
}

export const showSpecificPlanner = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.get('specific_planner/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: specificPlannerTypes.SUCCESS_SHOW_SPECIFIC_PLANNER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: specificPlannerTypes.FAIL_SHOW_SPECIFIC_PLANNER, response: error.response })
                });
        })
    }
}

export const deleteSpecificPlanner = (id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.delete('specific_planner/' + id)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: specificPlannerTypes.SUCCESS_DELETE_SPECIFIC_PLANNER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: specificPlannerTypes.FAIL_DELETE_SPECIFIC_PLANNER, response: error.response })
                });
        })
    }
}

export const saveSpecificPlanner = (payload) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.post('specific_planner', payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: specificPlannerTypes.SUCCESS_SAVE_SPECIFIC_PLANNER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: specificPlannerTypes.FAIL_SAVE_SPECIFIC_PLANNER, response: error.response })
                });
        })
    }
}
export const updateSpecificPlanner = (payload, id) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            axios.put('specific_planner/' + id, payload)
                .then(response => {
                    resolve(response);
                    dispatch({
                        type: specificPlannerTypes.SUCCESS_UPDATE_SPECIFIC_PLANNER,
                        data: response.data
                    })
                })
                .catch(error => {
                    reject(error.response);
                    dispatch({ type: specificPlannerTypes.FAIL_UPDATE_SPECIFIC_PLANNER, response: error.response })
                });
        })
    }
}