import React, { useState } from "react";
import ChatBox, { ChatFrame } from '../../helpers/react-chat-plugin/src/index';
import { useSelector, useDispatch } from 'react-redux';
import * as chatAction from '../../store/actions/auction/auctionActions';

const Chats = props => {
  const [attr, setAttr] = useState(props.parentState.history_chat);
	const unreadMsg = useSelector(state => state.chat.unreadMsgBuyer);
	const typing = useSelector(state => state.typing?.typing?.response);
	const dispatch = useDispatch()

  const handleClickIcon = () => {
    setAttr({
      ...attr,
      showChatbox: !attr.showChatbox,
      showIcon: !attr.showIcon,
    });
		dispatch(chatAction.unreadChatBuyer({ type: false }))
  };

  const handleOnSendMessage = (message) => {
		props.ws.send(`{"type":"send", "value": "${message}" }`);
  };

  return (
		<div>
			<ChatFrame
				chatbox={
					<ChatBox
						onSendMessage={handleOnSendMessage}
						userId={1}
						messages={props.messages}
						width={'350px'}
						showTypingIndicator={false}
						placeholder="Type a message ..."
						// onLoadPrev={(e) => loadMore(e)}
						// onLoadNext={(e) => loadMore(e)}
						showPagination={false}
						loadchat={props.parentState.incomingChat}
						disableInput={props.parentState.disableChat}
						hideInputChat={props.parentState.hideInputChat}
						activeAuthor={typing}
					/>
				}
				// icon={<button type="button" className="btn btn-xs btn-primary"> Load More </button>}
				msgUnread={unreadMsg}
				clickIcon={handleClickIcon}
				showChatbox={attr.showChatbox}
				showIcon={attr.showIcon}
				iconStyle={{ background: '#52e80a', fill: 'white' }}
			>
			</ChatFrame>
		</div>
  );
}

export default Chats;