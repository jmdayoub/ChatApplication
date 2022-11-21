import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import PropTypes from "prop-types";
import messageServices from "../../services/messageService";
import debug from "sabio-debug";
import toastr from "toastr";
import "./Chatbox.css";
import { FiSend } from "react-icons/fi";
import { EmojiSmile, Paperclip, Mic } from "react-bootstrap-icons";
import ChatMessage from "./ChatMessage";
import FileUpload from "../fileUpload/FileUpload";

const _logger = debug.extend("Chatbox");

const ChatBox = ({
  currentUser,
  messages,
  recipientId,
  updateMessage,
  counter,
}) => {
  const [message, setMessage] = useState({
    id: "",
    message: "",
    subject: "",
    recipientId: "",
    isFile: false,
    senderId: 1,
    counter: 0,
  });

  const [displayMessages, setDisplayMessages] = useState([]);

  useEffect(() => {
    setDisplayMessages((prevState) => {
      let newMsgs = [...prevState];
      newMsgs = messages.map(mapMessage);
      return newMsgs;
    });
  }, [messages.length, messages, counter]);

  useEffect(() => {
    if (recipientId) {
      setMessage((prevState) => {
        return { ...prevState, recipientId: recipientId };
      });
    }
  }, [recipientId]);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };
  useEffect(scrollToBottom);

  const onFileClick = () => {
    setMessage((prevState) => {
      const msg = { ...prevState };
      msg.isFile = !msg.isFile;
      return msg;
    });
  };

  const onSendClicked = (e) => {
    _logger("SendMessageClicked", e);
    e.preventDefault();
    let payload = {};
    payload.isFile = message.isFile;
    payload.message = message.message;
    payload.dateSent = new Date();
    payload.senderId = currentUser.id;
    payload.recipientId = message.recipientId;
    payload.subject = message.subject;
    messageServices
      .addMessage(payload)
      .then(onSendMessageSuccess)
      .catch(onSendMessageError);
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
      const prevMessage = { ...prevState };
      prevMessage.message = "";
      prevMessage.isFile = false;
      return prevMessage;
    });
  };

  const onSendMessageError = (error) => {
    _logger("sendMessageError", error);
    toastr["error"]("Message not sent", "Error");
  };

  false && _logger(messages);
  const mapMessage = (message) => {
    return (
      <ChatMessage
        id={message.id}
        message={message}
        key={"MessageList-" + message.id}
        senderId={message.senderId}
        avatarUrl={message?.sender?.avatarUrl}
        recipientId={message.recipientId}
        currentUser={currentUser}
        updateMessage={updateMessage}
      />
    );
  };

  const onFileUploadSuccess = (response) => {
    _logger(response[0].url, "Response-items");
    setMessage((prevState) => {
      const newFile = { ...prevState };
      newFile.message = response[0].url;
      newFile.isFile = true;
      return newFile;
    });
  };

  const autoSubmitLink = () => {
    let payload = {};
    payload.message = message.message;
    payload.dateSent = new Date();
    payload.senderId = currentUser.id;
    payload.recipientId = message.recipientId;
    payload.subject = message.subject;
    messageServices
      .addMessage(payload)
      .then(onSendMessageSuccess)
      .catch(onSendMessageError);
  };

  return (
    <Card className="position-relative px-0 pb-0 mx-3">
      <SimpleBar className="chatarea-simplebar-chats my-5 mx-2 vh-50">
        {displayMessages}
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
                      disabled={message.message === ""}
                    >
                      <FiSend />
                    </button>
                    {/* <button
                      type="button"
                      className="btn chat-btn-primary chat-send mx-1 btn-block"
                      onClick={createACall}
                    >
                      Call
                    </button> */}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Col>
        <div className="mt-3 d-flex">
          <div>
            <Link to="#" className="text-link me-2">
              {" "}
              {message.isFile && (
                <FileUpload onUploadSuccess={onFileUploadSuccess}></FileUpload>
              )}
              <EmojiSmile size={16} />
            </Link>
            <button onClick={onFileClick} className="btn btn-link me-2">
              {" "}
              <Paperclip size={16} />
            </button>
            <Link to="#" className="text-link me-2">
              {" "}
              <Mic size={16} />
            </Link>
            <div ref={messagesEndRef} />
          </div>
        </div>
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
  onClick: PropTypes.func,
  children: PropTypes.string,
  position: PropTypes.string,
  messageId: PropTypes.number,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  recipientId: PropTypes.string.isRequired,
  dateSent: PropTypes.string,
  updateMessage: PropTypes.func,
  counter: PropTypes.number,
};
