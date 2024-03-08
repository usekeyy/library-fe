import * as actionTypes from '../../constants/maintPlannerGroupTypes';

const initState = {
	maintPlannerGroup: {},
	response: '',
	optionPaginate: '',
	search: '',
}

const maintPlannerGroupReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_FETCH_MAINT_PLANNER_GROUP: 
			return {...state, maintPlannerGroup: action.data, optionPaginate: action.optionPaginate, search: action.search, status: action.status}
		case actionTypes.FAIL_FETCH_MAINT_PLANNER_GROUP:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SAVE_MAINT_PLANNER_GROUP:
			return {...state, response: action.response}
		case actionTypes.FAIL_SAVE_MAINT_PLANNER_GROUP:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SHOW_MAINT_PLANNER_GROUP:
			return {...state, response: action.response, data: action.data}
		case actionTypes.FAIL_SHOW_MAINT_PLANNER_GROUP:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_UPDATE_MAINT_PLANNER_GROUP:
			return {...state, response: action.response}
		case actionTypes.FAIL_UPDATE_MAINT_PLANNER_GROUP:
			return {...state, response: action.response}
		default:
			return state
	}
}

export default maintPlannerGroupReducer;