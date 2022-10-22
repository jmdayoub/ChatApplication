import axios from "axios";
import { onGlobalError, onGlobalSuccess } from "./serviceHelpers";

const API = process.env.REACT_APP_API_HOST_PREFIX;

const messageService = {
  endpoint: `${API}/api/messages`,
};

const addMessage = (message) => {
  const config = {
    method: "POST",
    url: messageService.endpoint,
    data: message,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getById = (id) => {
  const config = {
    method: "GET",
    url: `${messageService.endpoint}/${id}`,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByConversation = () => {
  const config = {
    method: "GET",
    url: `${messageService.endpoint}/conversation`,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByRecipientId = (recipientId) => {
  const config = {
    method: "GET",
    url: `${messageService.endpoint}/recipient/${recipientId}`,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getUsersInConvos = () => {
  const config = {
    method: "GET",
    url: `${messageService.endpoint}/conversation/users`,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteById = (id) => {
  const config = {
    method: "DELETE",
    url: `${messageService.endpoint}/${id}`,
    headers: {"Content-Type": "application/json"},
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const updateMessage = (id, message) => {
  const config = {
    method: "PUT",
    data: message,
    url: `${messageService.endpoint}/${id}`,
    headers: {"Content-Type": "application/json"},
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const messageServices = {
  addMessage,
  getById,
  getByConversation,
  getByRecipientId,
  getUsersInConvos,
  deleteById,
  updateMessage,
};

export default messageServices;
