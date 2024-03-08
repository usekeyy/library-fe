import * as verifikasiDataTypes from '../../constants/vendor/verifikasiDataTypes';

const initState = {
    verification: {}
}

const verifikasiVendorReducers = (state = initState, action) => {
	switch (action.type) {
		case verifikasiDataTypes.SUCCESS_SHOW_LAST_VERIFIKASI: 
			return {...state, verification: action.response }
		case verifikasiDataTypes.FAIL_SHOW_LAST_VERIFIKASI:
			return {...state, verification: {}}
		default:
			return state
	}
}

export default verifikasiVendorReducers;