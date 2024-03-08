import * as districtsType from '../../constants/districtsType';

const initState = {
    currencies: {},
}

const districtsReducers = (state = initState, action) => {
    switch (action.type) {
        case districtsType.SUCCESS_FETCH_DISTRICTS:
            return { ...state, response: action.resp }
        default:
            break;
    }
}

export default districtsReducers;