import * as actionTypes from '../../constants/uomTypes';

const initState = {
	uom: {},
	response: '',
	optionPaginate: '',
	search: '',
}

const uomReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_FETCH_UOM: 
			return {...state, uom: action.data, optionPaginate: action.optionPaginate, search: action.search, status: action.status}
		case actionTypes.FAIL_FETCH_UOM:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SAVE_UOM:
			return {...state, response: action.response}
		case actionTypes.FAIL_SAVE_UOM:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SHOW_UOM:
			return {...state, response: action.response, data: action.data}
		case actionTypes.FAIL_SHOW_UOM:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_UPDATE_UOM:
			return {...state, response: action.response}
		case actionTypes.FAIL_UPDATE_UOM:
			return {...state, response: action.response}
		default:
			return state
	}
}

export default uomReducer;