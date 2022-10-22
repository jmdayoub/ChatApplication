import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import PropTypes from "prop-types";
import messageServices from "services/messageService";
import debug from "sabio-debug";
import toastr from "toastr";
import "./Chatbox.css"
import { FiSend } from "react-icons/fi";
import ChatMessage from "./ChatMessage";

const _logger = debug.extend("Chatbox");

const ChatBox = ({ currentUser, messages, recipientId}) => {

  const [message, setMessage] = useState({
    id: "",
    message: "",
    subject: "",
    recipientId: "",
    senderId: currentUser.id,
  });

  const [displayMessages, setDisplayMessages] = useState([]);

  useEffect(() => {
    setDisplayMessages((prevState) => {
      let newMsgs = [...prevState];
      newMsgs = messages.map(mapMessage);
      return newMsgs;
    })
  },[messages.length,messages])

  const messagesEndRef = useRef(null);
	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'nearest'
		});
	};
	useEffect(scrollToBottom);

  useEffect(() => {
    if (recipientId) {
      setMessage((prevState) => {
        return { ...prevState, recipientId: recipientId };
      });
    }
  }, [recipientId]);
  
  const onSendClicked = (e) => {
    _logger("SendMessageClicked", e);
    e.preventDefault();
    let payload = {};
    payload.message = message.message;
    payload.dateSent = new Date();
    payload.senderId = currentUser.id;
    payload.recipientId = message.recipientId;
    payload.subject = message.subject;
    messageServices.addMessage(payload).then(onSendMessageSuccess).catch(onSendMessageError)
  };

  const onMessageUpdate = (e) => {
    setMessage((prevState) => {
      const updatedMsg = { ...prevState };
      updatedMsg.message = e.target.value;
      return updatedMsg;
    });
  };

  const onSendMessageSuccess = (response) => {
    _logger("sendMessageSuccess", response.item);
    setMessage((prevState) => {
      const prevMessage = {...prevState};
      prevMessage.message = "";
      return prevMessage;
    });
  };

  const onSendMessageError = (error) => {
    _logger("sendMessageError", error);
    toastr["error"]("Message not sent", "Error")
  };

  false && _logger(messages);

  const mapMessage = (message) => {
    return (
      <ChatMessage
        id={message.id}
        message={message}
        key={"MessageList-" + message.id}
        senderId={message.senderId}
        recipientId={message.recipientId}
        currentUser={currentUser}
      />
    );
    }

  return (    
    <Card className="position-relative px-0 pb-0 mx-3">
        <SimpleBar className="chatarea-simplebar-chats my-5 mx-2 vh-50">        
          {displayMessages && displayMessages}          
          <div ref={messagesEndRef} />
        </SimpleBar>
        <Row className="px-3 pb-3">
          <Col>
            <div className="mt-2 bg-light p-3 rounded">
                <form noValidate name="chat-form" id="chat-form" className="my-2">
                  <div className="row">
                    <div className="col mb-2 mb-sm-0">
                      <input
                        onChange={onMessageUpdate}
                        value={message.message}
                        type="text"
                        name="message"
                        className="form-control"
                        placeholder="Enter your message"
                      />
                    </div>
                    <div className="col-sm-auto">
                      <div className="btn-group">
                        <button
                          type="submit"
                          className="btn chat-btn-primary chat-send btn-block"
                          key="newMessageSend"
                          onClick={onSendClicked}
                        >
                          <FiSend/>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
            </div>
          </Col>
        </Row>
    </Card>
  );
};
export default React.memo(ChatBox);

ChatBox.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      recipientId: PropTypes.number.isRequired,
      senderId: PropTypes.number.isRequired,
      recipient: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string.isRequired,
      }),
      sender: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string.isRequired,
      }),
    })
  ),
  deleteMsg: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  children: PropTypes.string,
  position: PropTypes.string,
  messageId: PropTypes.number,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  recipientId: PropTypes.string.isRequired,
  addNewMsg: PropTypes.func.isRequired,
  dateSent: PropTypes.string
};
