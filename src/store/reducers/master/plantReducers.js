import * as actionTypes from '../../constants/plantTypes';

const initState = {
	plant: [],
	response: '',
	optionPaginate: '',
	search: '',
}

const plantReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_FETCH_PLANT: 
			return {...state, plant: action.data, optionPaginate: action.optionPaginate, search: action.search, status: action.status}
		case actionTypes.FAIL_FETCH_PLANT:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SAVE_PLANT:
			return {...state, response: action.response}
		case actionTypes.FAIL_SAVE_PLANT:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SHOW_PLANT:
			return {...state, response: action.response, data: action.data}
		case actionTypes.FAIL_SHOW_PLANT:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_UPDATE_PLANT:
			return {...state, response: action.response}
		case actionTypes.FAIL_UPDATE_PLANT:
			return {...state, response: action.response}
		default:
			return state
	}
}

export default plantReducer;