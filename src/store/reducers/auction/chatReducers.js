import * as auctionTypes from '../../constants/auction/auctionTypes';

const initState = {
	unreadMsgVendor: null,
	unreadMsgBuyer: null,
	history_chat: []
}

const chatReducers = (state = initState, action) => {
	switch (action.type) {
		case auctionTypes.SUCCESS_FETCH_CHAT_AUCTION: 
			return {...state, history_chat: action.response }
		case auctionTypes.APPEND_CHAT_AUCTION: {
			let arr = [];
			const sendObj = {
				id: action.response.id,
					created_by: action.response.created_by,
					updated_by: action.response.updated_by,
					auctions_id: action.response.auctions_id,
					message: action.response.message,
					created_at: action.response.created_at,
					updated_at: action.response.updated_at,
					name: action.response.name,
			};
			if(state.history_chat === null){
				arr.push(sendObj);
				return {...state, history_chat: arr }
			} else {
				if(state.history_chat.length > 0){
					return {
						...state,
						history_chat: [ ...state.history_chat, sendObj ]
					}
				} else {
					arr.push(sendObj);
					return {...state, history_chat: arr }
				}
			}
		}
		case auctionTypes.FAIL_FETCH_CHAT_AUCTION:
			return {...state, history_chat: [], unreadMsgVendor: false, unreadMsgBuyer: false}
		case auctionTypes.UNREAD_CHAT_AUCTION_BUYER: 
			return {...state, unreadMsgBuyer: true }
		case auctionTypes.READ_CHAT_AUCTION_BUYER: 
			return {...state, unreadMsgBuyer: false }
		case auctionTypes.UNREAD_CHAT_AUCTION_VENDOR: 
			return {...state, unreadMsgVendor: true }
		case auctionTypes.READ_CHAT_AUCTION_VENDOR: 
			return {...state, unreadMsgVendor: false }
		case auctionTypes.CLEAR_CHAT_AUCTION_VENDOR: 
			return {...state, unreadMsgVendor: false, unreadMsgBuyer: false }
		default:
			return state
	}
}

export default chatReducers;