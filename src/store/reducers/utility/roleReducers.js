import * as actionTypes from '../../constants/actionTypes';

const initState = {
	role: {},
	response: '',
	optionPaginate: '',
	search: '',
}

const routeReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_FETCH_ROLE: 
			return {...state, role: action.data, optionPaginate: action.optionPaginate, search: action.search, status: action.status}
		case actionTypes.FAIL_FETCH_ROLE:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SAVE_ROLE:
			return {...state, response: action.response}
		case actionTypes.FAIL_SAVE_ROLE:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SHOW_ROLE:
			return {...state, response: action.response, data: action.data}
		case actionTypes.FAIL_SHOW_ROLE:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_UPDATE_ROLE:
			return {...state, response: action.response}
		case actionTypes.FAIL_UPDATE_ROLE:
			return {...state, response: action.response}
		default:
			return state
	}
}

export default routeReducer;