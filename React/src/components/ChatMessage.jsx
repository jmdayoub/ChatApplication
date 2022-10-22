import React, {useState} from "react"; //, useEffect
// import { Formik, Form, Field} from "formik";
/* eslint-disable react/prop-types */
import {Image, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import { FiMoreVertical, FiEdit, FiTrash, FiSend} from "react-icons/fi";
import messageServices from "services/messageService";
const _logger = debug.extend("Chatbox");

const ChatMessage = ({message, currentUser}) => {

  const [showEdit, setShowEdit] = useState(false);
  const [updatedMsg, setUpdatedMessage] = useState();

    const currentUserProfile = {
    id: 37,
    firstName: "Marilyn",
    lastName: "Vega",
    avatarUrl:
      "https://images.unsplash.com/photo-1504020853563-338d87e28a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTgwOTN8MHwxfHNlYXJjaHwxM3x8aG9yc2UlMjBhdmF0YXJ8ZW58MHx8fHwxNjY0NDgxMjEw&ixlib=rb-1.2.1&q=80&w=1080",
  };

    const toggleEdit = (e) => {
      _logger(e.target.id);
      setShowEdit(!showEdit);
    }

    const onDeleteClicked = (e) => {
      const toDelete = e.target.id;
      messageServices.deleteById(Number(toDelete)).then(onDeleteSuccess).catch(onDeleteError)
    }

    const onDeleteSuccess = (response) => {
      _logger(response);
    }

    const onSendEditClicked = () => {
      let payload = {message: updatedMsg.message, subject: "Subject", recipientId: message.recipientId}
      messageServices.updateMessage(message.id, payload).then(onUpdateSuccess).catch(onUpdateError);
      setShowEdit(!showEdit);
    }

    const onUpdateSuccess = (response) => {
      _logger(response);
    }

    const onUpdateError = (error) => {
      _logger(error);
    }
  
    const onDeleteError = (error) => {
      _logger(error);
    }
    
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
            <i><FiMoreVertical/> </i>
          </Dropdown.Toggle>
          <Dropdown.Menu align="start" className="chat-dropdown-menu">
            {position === 'start' ? (
              <Dropdown.Item id={messageId} name={messageId} onClick={toggleEdit} eventKey="2" className="px-3 chat-dropdown-item-icon">
                <i><FiEdit/></i> Edit
              </Dropdown.Item>
            ) : null}
            <Dropdown.Item id={messageId} name={messageId} onClick={onDeleteClicked} eventKey="6" className="px-3 chat-dropdown-item-icon">
              <i><FiTrash/></i> Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    };

  let chatClass = "";
  let divClass = "";
    if (message.senderId === currentUser.id) {
      chatClass = "chat-item chatbox-me mx-2";
      divClass = "d-flex justify-content-end my-3";
    } else if (message.recipientId) {
      divClass = "d-flex justify-content-start my-3";
      chatClass = "chatbox-them chat-item mx-2";
    }   

  return (    
    <div id={String(message.id)} key={"MessageList-" + message.id} className={divClass}>
        <div className="my-1 avatar avatar-md avatar-indicators avatar-online d-flex mx-2">
            <Image
              src={message?.sender?.avatarUrl || currentUserProfile.avatarUrl}
              alt="sender"
              className="rounded-circle"
            />            
        </div>        
        <div className="d-flex">                      
          {!showEdit && <div><small className="mx-3">{new Date(message.dateSent).toLocaleString()}</small>
          <div className={chatClass}>{message.messageText || message.message}</div>    
          </div> }
          <div className="me-2 mt-2">
						{message.recipientId !== currentUser.id && (<ActionMenu messageId={message.id} position="start" />)}
            { showEdit && (
                <div>
                    <div className="col mb-2 mb-sm-0">
                      <input
                        type="text"
                        name="message"
                        className="form-control"
                        placeholder="Enter your message"
                        onChange={onMessageUpdate}>                          
                        </input>
                    </div>
                    <div className="col-sm-auto">
                      <div className="btn-group">
                        <button
                          type="submit"
                          className="btn chat-btn-primary chat-send btn-block"
                          key="editMessage"
                          onClick={onSendEditClicked}
                        >
                          <FiSend/>
                        </button>
                      </div>
                    </div>
                  </div>                
                )}
					</div>
        </div>
      </div>
  )
}

export default ChatMessage;

ChatMessage.propTypes = {
  message: PropTypes.shape({
      id: PropTypes.number.isRequired,
      recipientId: PropTypes.number,
      senderId: PropTypes.number.isRequired,
      dateSent: PropTypes.string,
      messageText: PropTypes.string,
      message: PropTypes.string,
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
  recipientId: PropTypes.string,
  addNewMsg: PropTypes.func,
};