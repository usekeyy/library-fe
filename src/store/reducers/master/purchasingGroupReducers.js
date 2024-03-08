import * as perchasingGroupTypes from '../../constants/perchasingGroupTypes';

const initState = {
    purchasingGroup: {},
}

const perchasingGroupReducer = (state = initState, action) => {
    switch (action.type) {
        case perchasingGroupTypes.SUCCESS_FETCH_PURCHASINGGROUP:
            return { ...state, response: action.resp }
        default:
            break;
    }
}

export default perchasingGroupReducer;