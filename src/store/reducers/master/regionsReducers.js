import * as regionsType from '../../constants/regionsType';

const initState = {
    incoterms: {},
}

const regionsReducers = (state = initState, action) => {
    switch (action.type) {
        case regionsType.SUCCESS_FETCH_REGIONS:
            return { ...state, response: action.resp }
        default:
            break;
    }
}

export default regionsReducers;