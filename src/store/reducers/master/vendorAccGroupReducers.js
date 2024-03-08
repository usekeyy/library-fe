import * as actionTypes from '../../constants/vendorAccGroupType';

const initState = {
	vendor_acc_group: {},
	response: '',
	optionPaginate: '',
	search: '',
}

const vendorAccGrpReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_FETCH_VENDOR_ACC_GROUP: 
			return {...state, vendor_acc_group: action.data, optionPaginate: action.optionPaginate, search: action.search, status: action.status}
		case actionTypes.FAIL_FETCH_VENDOR_ACC_GROUP:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SAVE_VENDOR_ACC_GROUP:
			return {...state, response: action.response}
		case actionTypes.FAIL_SAVE_VENDOR_ACC_GROUP:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_SHOW_VENDOR_ACC_GROUP:
			return {...state, response: action.response, data: action.data}
		case actionTypes.FAIL_SHOW_VENDOR_ACC_GROUP:
			return {...state, response: action.response}
		case actionTypes.SUCCESS_UPDATE_VENDOR_ACC_GROUP:
			return {...state, response: action.response}
		case actionTypes.FAIL_UPDATE_VENDOR_ACC_GROUP:
			return {...state, response: action.response}
		default:
			return state
	}
}

export default vendorAccGrpReducer;