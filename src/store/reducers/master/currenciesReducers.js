import * as currenciesType from '../../constants/currenciesType';

const initState = {
    currencies: {},
}

const currenciesReducers = (state = initState, action) => {
    switch (action.type) {
        case currenciesType.SUCCESS_FETCH_CURRENCIES:
            return { ...state, response: action.resp }
        default:
            break;
    }
}

export default currenciesReducers;