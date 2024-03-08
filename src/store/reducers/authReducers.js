import * as actionTypes from '../constants/actionTypes';
import {decrypt} from '../../config/generate';

const initState = {
		user: null,
		token: ((localStorage.getItem("token") !== null) && (localStorage.getItem("token"))) ? localStorage.getItem("token") : null,
		access: ( (localStorage.getItem('access-control') !== null) && decrypt((localStorage.getItem('access-control'))) ) ? decrypt(localStorage.getItem('access-control')) : 'NO',
		invoice_popup: true
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.SUCCESS_LOGIN_ACTION:
            return {...state, token: action.token, user: action.data, access: action.access, invoice_popup: true}
        case actionTypes.FAIL_LOGIN_ACTION:
            return {user: null, token: null, access: 'NO', invoice_popup: false}
        case actionTypes.SUCCESS_LOGOUT_ACTION:
            localStorage.removeItem('access-control');
            localStorage.removeItem('token');
            localStorage.removeItem('persist:root');
            return {...state, user: null, token: null, access: 'NO', invoice_popup: false}
        case actionTypes.MODAL_SHOW_FALSE:
            return {...state, invoice_popup: false }
        case actionTypes.FAIL_LOGOUT_ACTION:
            return state
        default:
            return state
    }
}

export default authReducer;