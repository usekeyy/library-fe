import * as actionTypes from '../../constants/purchasingOrgTypes';

const initState = {
	purchasing_org: {},
	response: '',
	optionPaginate: '',
	search: '',
}

const purchasingReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_FETCH_PURCHASING_ORG: 
			return {...state, purchasing_org: action.data, optionPaginate: action.optionPaginate, search: action.search, status: action.status}
		case actionTypes.FAIL_FETCH_PURCHASING_ORG:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SAVE_PURCHASING_ORG:
			return {...state, response: action.response}
		case actionTypes.FAIL_SAVE_PURCHASING_ORG:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SHOW_PURCHASING_ORG:
			return {...state, response: action.response, data: action.data}
		case actionTypes.FAIL_SHOW_PURCHASING_ORG:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_UPDATE_PURCHASING_ORG:
			return {...state, response: action.response}
		case actionTypes.FAIL_UPDATE_PURCHASING_ORG:
			return {...state, response: action.response}
		default:
			return state
	}
}

export default purchasingReducer;