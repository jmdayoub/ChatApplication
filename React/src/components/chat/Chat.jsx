import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import messageServices from "../../services/messageService";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import Sidebar from "./sidebar/Sidebar";
import ChatBox from "./ChatBox";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import * as helper from "../../../src/services/serviceHelpers";

const _logger = debug.extend("Chatbox");

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState({
    arrayOfMessages: [],
    selectedMessages: [],
    recipientId: "",
  });

  var counter = useRef(0);

  useEffect(() => {
    // messageServices
    //   .getByConversation()
    //   .then(getByConvoSuccess)
    //   .catch(getByConvoError);
  }, []);

  const connection = new HubConnectionBuilder()
    .withUrl(`${helper.API_HOST_PREFIX}/hubs/chathub`)
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .build();

  useEffect(() => {
    _logger("connection", connection);
    connection.start().then(() => {
      _logger("Connected!", connection);
      connection.on("SendMessage", (message) => {
        setMessages((prevState) => {
          const newAr = { ...prevState };
          const newMessages = [...newAr.selectedMessages];
          newAr.arrayOfMessages.push(message);
          newMessages.push(message);
          newAr.selectedMessages = newMessages;
          return newAr;
        });
      });
      connection.on("DeleteMessage", (message) => {
        setMessages((prevState) => {
          const newAr = { ...prevState };
          newAr.arrayOfMessages = newAr.arrayOfMessages.filter(
            (x) => String(x.id) !== String(message.id)
          );
          newAr.selectedMessages = newAr.selectedMessages.filter(
            (x) => String(x.id) !== String(message.id)
          );
          return newAr;
        });
      });
      connection.on("UpdateMessage", updateMessage);
    });
  }, []);

  const updateMessage = (message) => {
    setMessages((prev) => {
      let p = { ...prev };
      const idxOf = p.arrayOfMessages.findIndex((x) => x.id === message.id);
      if (idxOf >= 0) {
        p.arrayOfMessages[idxOf] = message;
      }
      const idxOfSelected = p.selectedMessages.findIndex(
        (x) => x.id === message.id
      );
      if (idxOfSelected >= 0) {
        p.selectedMessages[idxOfSelected] = message;
      }
      return p;
    });
    counter.current++;
  };

  const getByConvoSuccess = (response) => {
    response.items.forEach((item) => {
      item.dateSent = `${item.dateSent}Z`;
    });
    let arrayOfMsgs = response.items;
    _logger(response.items);
    setMessages((prevState) => {
      const md = { ...prevState };
      md.arrayOfMessages = arrayOfMsgs;
      return md;
    });
  };
  const getByConvoError = (error) => {
    _logger("GetById Error=>", error);
  };

  const onCardClicked = (target) => {
    target = Number(target);
    _logger("onCardClicked firing", target);
    const filterConvo = (convo) => {
      let result = false;
      if (target === convo.senderId || target === convo.recipientId) {
        if (
          currentUser.id === convo.senderId ||
          currentUser.id === convo.recipientId
        ) {
          result = true;
        }
        return result;
      }
    };
    setMessages((prevState) => {
      const newAr = { ...prevState };
      newAr.selectedMessages = newAr.arrayOfMessages.filter(filterConvo);
      _logger("onCardClicked firing", newAr.selectedMessages);
      newAr.recipientId = target;
      return newAr;
    });
  };

  return (
    <>
      <Row className="g-0">
        <Col xl={3} lg={12} md={12} xs={12}>
          <Sidebar
            currentUser={currentUser}
            cardClicked={onCardClicked}
          ></Sidebar>
        </Col>
        <Col xl={9} lg={12} md={12} xs={12}>
          <ChatBox
            currentUser={currentUser}
            messages={messages.selectedMessages}
            dateSent={messages.selectedMessages.dateSent}
            recipientId={messages.recipientId.toString()}
            updateMessage={updateMessage}
            counter={counter.current}
          />
        </Col>
      </Row>
    </>
  );
};

export default Chat;

Chat.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }),
};
