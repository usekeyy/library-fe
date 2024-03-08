import * as companyTypes from '../../constants/companyTypes';

const initState = {
    company: {},
    response: '',
    optionPaginate: '',
    search: '',
}

const companyReducer = (state = initState, action) => {
    switch (action.type) {
        case companyTypes.SUCCESS_FETCH_COMPANY:
            return { ...state, response: action.resp }
        default:
            break;
    }
}

export default companyReducer;