import * as actionTypes from '../../constants/tendering/proposalTenderTypes';

const initState = {
	selected_items_pr: []
}

const setSelectedItemsPrReducers = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_SET_SELECTED_ITEMS_PR: 
			return {...state, selected_items_pr: action.data}
		case actionTypes.FAIL_SET_SELECTED_ITEMS_PR:
			return {...state, selected_items_pr: []}
		default:
			return state
	}
}

export default setSelectedItemsPrReducers;