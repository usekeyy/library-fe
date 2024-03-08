import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-textarea-autosize';
import { strip } from './utils';
import { KEYS } from './constant';
// import SendIcon from './sendIcon.svg';
import {debounce} from '../../debounce';
import * as chatAction from '../../../store/actions/auction/auctionActions';

export default function InputBox(props) {
  const [inputText, setInputText] = useState('');
	const dispatch = useDispatch()
	const users = useSelector(state => state.auth.user.data);
	const debounced = debounce(text => dispatch(chatAction.onTyping({ type: false })) );

  const handleOnChange = (e) => {
    setInputText(e.target.value);
  };

  const handleOnClick = (e) => {
    const str = strip(inputText);
    if (str.length) {
      sendMessage(str);
    } else {
      // to do cannot send empty message
    }
  };

  const onKeyPress = (e) => {
		const sendResp = { username: `${users.name}`, id: 2, avatarUrl: 'https://image.flaticon.com/icons/svg/2446/2446032.svg' }
		dispatch(chatAction.onTyping({ type: true, response: sendResp }))
    if (
      (props.onSendKey === undefined || e[props.onSendKey]) &&
      e.charCode === 13
    ) {
      const str = strip(inputText);
      if (str.length) {
        sendMessage(str);
      }
      e.preventDefault();
      return false;
    }
		debounced()
  };

  const sendMessage = (message) => {
    props.onSendMessage(message);
    setInputText('');
  };

  return (
    <div className={`react-chat-inputBox ${props.disabled ? 'disabled' : ''}`}>
      <TextareaAutosize
        maxRows={3}
        className="react-chat-textarea"
        placeholder={
          props.disabled ? props.disabledInputPlaceholder : props.placeholder
        }
        value={inputText}
        onChange={handleOnChange}
        onKeyPress={onKeyPress}
        autoFocus
        disabled={props.disabled}
      />
      <button
        className="react-chat-sendButton"
        onClick={handleOnClick}
        disabled={props.disabled}
      >
				<span className="fa fa-paper-plane"></span>
        {/* <SendIcon
          className={
            props.disabled
              ? 'react-chat-SendIcon-disable'
              : 'react-chat-SendIcon'
          }
        /> */}
      </button>
    </div>
  );
}

InputBox.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  disabledInputPlaceholder: PropTypes.string,
  placeholder: PropTypes.string,
  onSendKey: PropTypes.oneOf(KEYS),
};
