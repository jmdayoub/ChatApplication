import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Col, Row, Image, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import messageServices from "services/messageService";
import { FiEdit, FiSettings } from "react-icons/fi";

const _logger = debug.extend("Sidebar");

const Sidebar = ({ messages, currentUser, cardClicked }) => {
  const [usersInConvos, setUsersInConvos] = useState({
    arrayOfUsers: [],
    userComponents: [],
  });
  const [search, setSearchTerm] = useState({
    term: "",
  });

  const [options, setOptions] = useState({
    newUserArray: [],
  });

  useEffect(() => {
    messageServices
      .getUsersInConvos()
      .then(getUsersInConvosSuccess)
      .catch(getUsersInConvosError);
    messageServices
      .getClientsOrVets()
      .then(getClientsOrVetsSuccess)
      .catch(getClientsOrVetsError);
  }, []);
  const getUsersInConvosSuccess = (response) => {
    let responseData = response.items;
    setUsersInConvos((prevState) => {
      const ud = { ...prevState };
      ud.responseData = response.items;
      ud.arrayOfUsers = responseData.map(mapUser);
      return ud;
    });
  };

  const getClientsOrVetsSuccess = (response) => {
    _logger(response.items, "Client or Vet response");
    setOptions((prevState) => {
      let newOptions = { ...prevState };
      newOptions.newUserArray = response.items;
      newOptions.options = response.items.map(sendToSelect);
      return newOptions;
    });
  };

  const sendToSelect = (item) => {
    const name = `${item.title} ${item.firstName} ${item.lastName}`;
    return { value: item.id, label: name };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const target = e.target;
    const value = e.target.value;
    const inputField = target.name;
    setSearchTerm((prevState) => {
      const newSearch = { ...prevState };
      newSearch[inputField] = value;
      setUsersInConvos((prevState) => {
        _logger(value, "value handleSearch");
        const sd = { ...prevState };
        _logger(sd.arrayOfUsers);
        if (newSearch.term === "") {
          sd.arrayOfUsers = sd.responseData.map(mapUser);
          return sd;
        } else {
          sd.filteredData = sd.responseData.filter(
            (x) => x.firstName.includes(value) || x.lastName.includes(value)
          );
          sd.arrayOfUsers = sd.filteredData.map(mapUser);
          return sd;
        }
      });
      return newSearch;
    });
  };
  const getUsersInConvosError = (error) => {
    _logger("getUsersInConvos Error", error);
  };

  false && _logger(messages);

  const onCardClicked = (e) => {
    cardClicked(e.target.id);
  };

  const getClientsOrVetsError = (error) => {
    _logger("getUsersInConvos Error", error);
  };

  const addUser = (values) => {
    _logger(options.newUserArray, "New User Array");
    const newUser = options.newUserArray.filter((x) => x.id === values.value);
    if (newUser.length >= 1) {
      setUsersInConvos((prevState) => {
        const newUsers = { ...prevState };
        newUsers.responseData.push(newUser[0]);
        newUsers.arrayOfUsers = newUsers.responseData.map(mapUser);
        return newUsers;
      });
    }
  };

  const mapUser = (user) => {
    if (user.id !== currentUser.id) {
      return (
        <Row className="my-4" key={"UserList-" + user.id}>
          <Card className="chat-item">
            <div>
              <Card.Body id={user.id} name={user.id} onClick={onCardClicked}>
                <Image
                  src={user.avatarUrl}
                  alt="recipient"
                  className="mx-1 rounded-circle my-1 avatar avatar-md avatar-indicators avatar-online"
                />
                {user.title} {user.firstName} {user.lastName}
              </Card.Body>
            </div>
          </Card>
        </Row>
      );
    }
  };
  return (
    <div className="bg-white border-end border-top vh-100">
      <div className="chat-window">
        <div className="chat-sticky-header sticky-top bg-white">
          <div className="px-4 pt-3 pb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex">
                <h1 className="mb-0 fw-bold h2 mx-1">Chat</h1>
              </div>
              <div className="d-flex">
                <button className="chat-btn-primary rounded-circle icon-shape icon-md texttooltip me-1">
                  <FiEdit />
                </button>
                <Link
                  to="#"
                  className="chat-btn-light rounded-circle icon-shape icon-md texttooltip me-1"
                >
                  <FiSettings />
                  <div id="newchat" className="d-none">
                    <span>New Chat</span>
                  </div>
                </Link>
              </div>
            </div>
            <div className="mt-4 mb-4">
              <input
                type="search"
                name="term"
                onChange={handleSearch}
                value={search.term}
                className="form-control form-control-sm"
                placeholder="Search for other users"
              />
            </div>
            <div className="mt-4 mb-4">
              <Select
                options={options.options}
                onChange={addUser}
                placeholder="Select a client or provider"
              />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Link to="#" className="text-link">
                <div className="d-flex">
                  <div className="avatar avatar-md avatar-indicators avatar-online">
                    <Image
                      src="https://images.unsplash.com/photo-1470422862902-688c1ae73e86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTgwOTN8MHwxfHNlYXJjaHw3fHxob3JzZSUyMGF2YXRhcnxlbnwwfHx8fDE2NjQ0ODEyMTA&ixlib=rb-1.2.1&q=80&w=1080"
                      alt=""
                      className="rounded-circle"
                    />
                  </div>
                  <div className=" ms-2">
                    <h5 className="mb-0">
                      {currentUser.firstName} {currentUser.lastName}
                    </h5>
                    <p className="mb-0 text-muted">Online</p>
                  </div>
                </div>
              </Link>
            </div>
            <Col>{usersInConvos.arrayOfUsers}</Col>
          </div>
          <Row>
            <Col lg={12} md={12} sm={12}></Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
Sidebar.propTypes = {
  cardClicked: PropTypes.func.isRequired,
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
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};
