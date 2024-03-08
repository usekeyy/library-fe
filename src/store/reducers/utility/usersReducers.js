import * as actionTypes from '../../constants/actionTypes';

const initState = {
	users: {},
	response: '',
}

const routeReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_FETCH_USERS: 
			return {...state, users: action.data, optionPaginate: action.optionPaginate, search: action.search, status: action.status}
		case actionTypes.FAIL_FETCH_USERS:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SAVE_USERS:
			return {...state, response: action.response}
		case actionTypes.FAIL_SAVE_USERS:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SHOW_USERS:
			return {...state, response: action.response, data: action.data}
		case actionTypes.FAIL_SHOW_USERS:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_UPDATE_USERS:
			return {...state, response: action.response}
		case actionTypes.FAIL_UPDATE_USERS:
			return {...state, response: action.response}
		default:
			return state
	}
}

export default routeReducer;