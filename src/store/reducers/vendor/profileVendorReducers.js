import * as actionTypes from '../../constants/vendor/profileVendorTypes';
import * as konfirmasiTypes from '../../constants/vendor/konfirmasiTypes';

const initState = {
	vendor: {},
	vendor_uuid: null,
	verification_uuid: null,
	collapseActive: ''
}

const profileVendorReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SUCCESS_FETCH_PROFILE_VENDOR: 
			return {...state, vendor: action.data, vendor_uuid: action.vendor_uuid, verification_uuid: action.verification_uuid  }
		case actionTypes.FAIL_FETCH_PROFILE_VENDOR:
			return {...state, vendor: {}, vendor_uuid: null, verification_uuid: null}
		case konfirmasiTypes.SUCCESS_SET_COLLAPSE_ACTIVE:
			return {...state, collapseActive: action.collapseActive}
		case konfirmasiTypes.FAIL_SET_COLLAPSE_ACTIVE:
			return {...state, collapseActive: ''}
		default:
			return state
	}
}

export default profileVendorReducer;