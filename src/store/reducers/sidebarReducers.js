import * as actionTypes from '../constants/actionTypes';

const initState = {
	sidebar: [],
    location: null,
    parent_access: null,
    access: null
}

const sidebarReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.SUCCESS_FETCH_SIDEBAR:
            return {...state, sidebar: action.data}
        case actionTypes.FAIL_FETCH_SIDEBAR:
            return state
        case actionTypes.SUCCESS_FETCH_ACCESS:
            return {...state, parent_access: action.parent_access, access: action.access, location: action.location}
        case actionTypes.FAIL_FETCH_ACCESS:
            return state
        default:
            return state
    }
}

export default sidebarReducer;