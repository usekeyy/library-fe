import * as incotermsType from '../../constants/incotermsType';

const initState = {
    incoterms: {},
}

const incotermsReducers = (state = initState, action) => {
    switch (action.type) {
        case incotermsType.SUCCESS_FETCH_INCOTERMS:
            return { ...state, response: action.resp }
        default:
            break;
    }
}

export default incotermsReducers;