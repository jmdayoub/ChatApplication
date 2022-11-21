import React, { useState } from "react";
import { Image, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import { FiMoreVertical, FiEdit, FiTrash, FiSend } from "react-icons/fi";
import messageServices from "services/messageService";
const _logger = debug.extend("Chatbox");

const ChatMessage = ({ message, currentUser, updateMessage }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [updatedMsg, setUpdatedMessage] = useState();

  const currentUserProfile = {
    id: 37,
    firstName: "Marilyn",
    lastName: "Vega",
    avatarUrl:
      "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTgwOTN8MHwxfHNlYXJjaHwxMnx8ZmFjZXxlbnwwfHx8fDE2NjY4NDY2MTE&ixlib=rb-4.0.3&q=80&w=1080",
  };

  const toggleEdit = (e) => {
    _logger(e.target.id);
    setShowEdit(!showEdit);
  };

  const onDeleteClicked = (e) => {
    const toDelete = e.target.id;
    messageServices
      .deleteById(Number(toDelete))
      .then(onDeleteSuccess)
      .catch(onDeleteError);
  };

  const onDeleteSuccess = (response) => {
    _logger(response);
  };

  const onSendEditClicked = () => {
    let payload = {
      message: updatedMsg.message,
      subject: "Subject",
      recipientId: message.recipientId,
      senderId: message.senderId,
      dateSent: message.dateSent,
    };
    messageServices
      .updateMessage(message.id, payload)
      .then(onUpdateSuccess)
      .catch(onUpdateError);
    setShowEdit(!showEdit);
    updateMessage({ id: message.id, messageText: payload.message });
  };

  const onUpdateSuccess = (response) => {
    _logger(response);
  };

  const onUpdateError = (error) => {
    _logger(error);
  };

  const onDeleteError = (error) => {
    _logger(error);
  };

  const onMessageUpdate = (e) => {
    message.messageText = e.target.value;
    setUpdatedMessage((prevState) => {
      const updatedMsg = { ...prevState };
      updatedMsg.message = e.target.value;
      return updatedMsg;
    });
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      to=""
      ref={ref}
      className="text-link"
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </Link>
  ));

  const ActionMenu = ({ position, messageId }) => {
    return (
      <Dropdown drop={position}>
        <Dropdown.Toggle as={CustomToggle}>
          <i>
            <FiMoreVertical />{" "}
          </i>
        </Dropdown.Toggle>
        <Dropdown.Menu align="start" className="chat-dropdown-menu">
          {position === "start" ? (
            <Dropdown.Item
              id={messageId}
              name={messageId}
              onClick={toggleEdit}
              eventKey="2"
              className="px-3 chat-dropdown-item-icon"
            >
              <i>
                <FiEdit />
              </i>{" "}
              Edit
            </Dropdown.Item>
          ) : null}
          <Dropdown.Item
            id={messageId}
            name={messageId}
            onClick={onDeleteClicked}
            eventKey="6"
            className="px-3 chat-dropdown-item-icon"
          >
            <i>
              <FiTrash />
            </i>{" "}
            Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  let chatClass = "";
  let divClass = "";
  if (message.senderId === currentUser.id) {
    chatClass = "chatbox-me mx-2";
    divClass = "d-flex justify-content-end my-3";
  } else if (message.recipientId) {
    divClass = "d-flex justify-content-start my-3";
    chatClass = "chatbox-them mx-2";
  }

  const isValidUrl = (urlString) => {
    var urlPattern = new RegExp(
      "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?"
    );
    return !!urlPattern.test(urlString);
  };

  const renderMessages = () => {
    if (isValidUrl(message.messageText || message.message) === true) {
      return (
        <a
          href={message.messageText || message.message}
          target="_blank"
          rel="noreferrer"
        >
          {message.messageText || message.message}
        </a>
      );
    } else if (
      roomLinkChecker(message.messageText || message.message) === true
    ) {
      return (
        <a
          href={message.messageText || message.message}
          target="_blank"
          rel="noreferrer"
        >
          Click Here To Join Call.
        </a>
      );
    } else {
      return message.messageText || message.message;
    }
  };

  const roomLinkChecker = (link) => {
    let result = false;
    if (link.indexOf("appointments/meeting?roomUrl=") >= 0) {
      result = true;
    }
    return result;
  };

  return (
    <div
      id={String(message.id)}
      key={"MessageList-" + message.id}
      className={divClass}
    >
      <div className="my-1 avatar avatar-md avatar-indicators avatar-online d-flex mx-2">
        <Image
          src={message?.sender?.avatarUrl || currentUserProfile.avatarUrl}
          alt="sender"
          className="rounded-circle"
        />
      </div>
      <div className="d-flex">
        {!showEdit && (
          <div>
            <small className="mx-3">
              {new Date(message.dateSent).toLocaleString()}
            </small>
            <div className={chatClass}>{renderMessages()}</div>
          </div>
        )}
        <div className="me-2 mt-2">
          {message.recipientId !== currentUser.id && (
            <ActionMenu messageId={message.id} position="start" />
          )}
          {showEdit && (
            <div>
              <div className="col mb-2 mb-sm-0">
                <input
                  type="text"
                  name="message"
                  className="form-control"
                  placeholder="Enter your message"
                  onChange={onMessageUpdate}
                  value={message.message || message.messageText}
                ></input>
              </div>
              <div className="col-sm-auto">
                <div className="btn-group">
                  <button
                    type="submit"
                    className="btn chat-btn-primary chat-send btn-block"
                    key="editMessage"
                    onClick={onSendEditClicked}
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);
ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    recipientId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    senderId: PropTypes.number.isRequired,
    dateSent: PropTypes.string,
    messageText: PropTypes.string,
    message: PropTypes.string,
    isFile: PropTypes.bool,
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
  }),
  onClick: PropTypes.func,
  onMessageUpdate: PropTypes.func,
  children: PropTypes.string,
  position: PropTypes.string,
  messageId: PropTypes.number,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
  recipientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateMessage: PropTypes.func,
};
