import * as countriesType from '../../constants/countriesType';

const initState = {
    countries: {},
}

const currenciesReducers = (state = initState, action) => {
    switch (action.type) {
        case countriesType.SUCCESS_FETCH_COUNTRIES:
            return { ...state, response: action.resp }
        default:
            break;
    }
}

export default currenciesReducers;