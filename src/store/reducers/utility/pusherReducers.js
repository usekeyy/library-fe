import * as actionTypes from '../../constants/actionTypes';

const initState = {
	data: null
}

const routeReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_FETCH_NOTIFICATION: 
			return {...state, data: action.data}
		case actionTypes.FAIL_FETCH_NOTIFICATION:
			return {...state, data: action.data}
		default:
			return state
	}
}

export default routeReducer;