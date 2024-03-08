import * as auctionTypes from '../../constants/auction/auctionTypes';

const initState = {
	typing: null
}

const chatReducers = (state = initState, action) => {
	switch (action.type) {
		case auctionTypes.SUCCESS_TYPING_CHAT_AUCTION: 
			return {...state, typing: action.response }
		case auctionTypes.FAIL_TYPING_CHAT_AUCTION: 
			return {...state, typing: null }
		default:
			return state
	}
}

export default chatReducers;