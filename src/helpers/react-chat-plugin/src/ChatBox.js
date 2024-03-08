import React from 'react';
import PropTypes from 'prop-types';

import { KEYS, TIMESTAMPFORMAT } from './constant';
import InputBox from './InputBox';
import MessageBox from './MessageBox';

import './ChatBox.css';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);
		this.state = { 
			loadchat: false
		}
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleOnSendMessage = this.handleOnSendMessage.bind(this);
  }

  scrollToBottom() {
    if (this.messagesList) {
      this.messagesList.scrollTop =
        this.messagesList.scrollHeight - this.messagesList.clientHeight;
    }
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps, prevState) {
		if (prevProps.loadchat !== this.state.loadchat) {
			this.scrollToBottom();
		}
	}

  handleOnSendMessage(message) {
    this.props.onSendMessage(message);
		// this.scrollToBottom();
  }

  render() {
    const {
      messages,
      userId,
      timestampFormat,
      height,
      width,
      disableInput,
      disabledInputPlaceholder,
      placeholder,
      style,
      showTypingIndicator,
      activeAuthor,
      onSendKey,
			showPagination,
			loadchat,
			hideInputChat
    } = this.props;

    const messageList = messages.map((message, idx) => {
      return (
        <MessageBox
          key={idx}
          left={message.author && message.author.id !== userId}
          timestampFormat={timestampFormat}
          {...message}
        />
      );
    });

    return (
      <div style={style} className="react-chat-container">
        <div className="react-chat-row">
          <div
            className="react-chat-viewerBox"
            style={{
              height: height,
              width: width,
            }}
          >
            {!loadchat && <div
              className="react-chat-messagesList"
              ref={(el) => (this.messagesList = el)}
            >
							{showPagination && <div className="text-center text-secondary react-chat-notification">
								<a href="/" onClick={() => this.props.onLoadPrev}> load prev </a>
							</div>}
              <div className="react-chat-messagesListContent">
                {messageList}
                {showTypingIndicator && activeAuthor !== null && (
                  <MessageBox
                    type="indicator"
                    author={activeAuthor}
                    text=""
                    left={true}
                  />
                )}
              </div>
							{showPagination && <div className="text-center text-secondary react-chat-notification">
								<a href="/" onClick={() => this.props.onLoadNext}> load more </a>
							</div>}
            </div>}
            {!hideInputChat && <InputBox
              onSendMessage={this.handleOnSendMessage}
              disabled={disableInput}
              placeholder={placeholder}
              disabledInputPlaceholder={disabledInputPlaceholder}
              onSendKey={onSendKey}
            />}
          </div>
        </div>
      </div>
    );
  }
}

ChatBox.propTypes = {
  messages: PropTypes.array,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  timestampFormat: PropTypes.oneOf(TIMESTAMPFORMAT),
  width: PropTypes.string,
  height: PropTypes.string,
  disableInput: PropTypes.bool,
  disabledInputPlaceholder: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  showTypingIndicator: PropTypes.bool,
  activeAuthor: PropTypes.object,
  onSendKey: PropTypes.oneOf(KEYS),
};

ChatBox.defaultProps = {
  messages: [],
  timestampFormat: 'calendar',
  disableInput: false,
  disabledInputPlaceholder: '',
  placeholder: '',
  showTypingIndicator: false,
  activeAuthor: null,
};

export default ChatBox;
