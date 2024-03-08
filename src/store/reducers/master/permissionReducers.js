import * as permissionTypes from '../../constants/permissionTypes';

const initState = {
    permission: {},
    response: '',
    optionPaginate: '',
    search: '',
}

const permissionReducers = (state = initState, action) => {
    switch (action.type) {
        case permissionTypes.SUCCESS_FETCH_PERMISSION:
            return { ...state, response: action.resp }
        default:
            break;
    }
}

export default permissionReducers;