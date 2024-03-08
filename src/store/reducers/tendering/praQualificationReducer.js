import * as actionTypes from '../../constants/actionTypes';

const initState = {
	tender_uuid: null,
}

const routeReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_SHOW_PRA_QUALIFICATION_DETAIL: 
			return {...state, tender_uuid: action.tender_uuid }
		case actionTypes.FAIL_SHOW_PRA_QUALIFICATION_DETAIL:
			return {...state, tender_uuid: null}
		default:
			return state
	}
}

export default routeReducer;