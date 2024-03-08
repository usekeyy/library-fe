import * as actionTypes from '../../constants/mrpControllerTypes';

const initState = {
	mrpController: {},
	response: '',
	optionPaginate: '',
	search: '',
}

const mrpControllerReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_FETCH_MRP_CONTROLLER: 
			return {...state, mrpController: action.data, optionPaginate: action.optionPaginate, search: action.search, status: action.status}
		case actionTypes.FAIL_FETCH_MRP_CONTROLLER:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SAVE_MRP_CONTROLLER:
			return {...state, response: action.response}
		case actionTypes.FAIL_SAVE_MRP_CONTROLLER:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SHOW_MRP_CONTROLLER:
			return {...state, response: action.response, data: action.data}
		case actionTypes.FAIL_SHOW_MRP_CONTROLLER:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_UPDATE_MRP_CONTROLLER:
			return {...state, response: action.response}
		case actionTypes.FAIL_UPDATE_MRP_CONTROLLER:
			return {...state, response: action.response}
		default:
			return state
	}
}

export default mrpControllerReducer;