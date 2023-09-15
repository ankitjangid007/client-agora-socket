"use client";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/authContext.jsx";
import { SocketContext } from "./context/SocketContext.jsx";
import { CgEnter } from "react-icons/cg";
import { RiVideoAddFill } from "react-icons/ri";
import { BiSolidPhoneCall } from "react-icons/bi";
import { FcEndCall } from "react-icons/fc";
import Dropdown from "react-bootstrap/Dropdown";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import JoinRequestSound from "./components/JoinRequestSound.jsx";

// Firebase
import { getToken } from "firebase/messaging";
import { messaging } from "./config/firebase-config";

const Home = () => {
  const [roomName, setRoomName] = useState("");
  const [newMeetDate, setNewMeetDate] = useState("");
  const [newMeetTime, setNewMeetTime] = useState("");

  const [joinRoomId, setJoinRoomId] = useState("");
  const [joinRoomError, setJoinRoomError] = useState("");
  const { logout } = useContext(AuthContext);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [joinRequests, setJoinRequests] = useState([]);
  const [closePopup, setClosePopup] = useState(false);
  const [playSound, setPlaySound] = useState(false);
  const [animate, setAnimate] = useState(false);

  const router = useRouter();

  const handleLogIn = () => {
    router.replace("/login");
  };

  const handleLogOut = (e) => {
    e.preventDefault();
    logout();
  };

  const { socket, setMyMeets, newMeetType, setNewMeetType } =
    useContext(SocketContext);

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const handleCreateRoom = () => {
    socket.emit("create-room", {
      userId,
      roomName,
      newMeetType,
      newMeetDate,
      newMeetTime,
    });
  };

  useEffect(() => {
    Notification.requestPermission().then(async (permission) => {
      console.log("Notification permission: ", permission);
      if (permission === "granted") {
        try {
          getToken(messaging, {
            vapidKey:
              "BC3YUpa53-GAEnBVk8xNbkQ5EQnIFb5XPa3o4Rl_KaCejAy0kG7HhYKXRBAx788aZInrtLihk0QuQRyCUk9em8w",
          }).then((token) => {
            console.log("Token:", token);
          });
        } catch (error) {
          console.log("Error: ", error);
        }
      }
    });
  }, []);

  const handleJoinRoom = async () => {
    await socket.emit("user-code-join", { roomId: joinRoomId });
    setRoomName("");
  };

  useEffect(() => {
    const handleRoomExists = ({ roomId }) => {
      router.push(`/meet/${roomId}`);
    };

    const handleRoomNotExist = () => {
      setJoinRoomId("");
      setJoinRoomError("Room doesn't exist! Please try again..");
    };

    const handleMeetsFetched = ({ myMeets }) => {
      setMyMeets(myMeets);
    };

    const handleNewJoinRequest = (request) => {
      setPlaySound(true);
      setAnimate(true);
      setClosePopup(false);

      // setTimeout(() => {
      //   setPlaySound(false);
      //   setAnimate(false);
      // }, 30000);

      setJoinRequests((prevRequests) => [...prevRequests, request]);
    };

    socket.on("room-exists", handleRoomExists);
    socket.on("room-not-exist", handleRoomNotExist);
    socket.on("meets-fetched", handleMeetsFetched);
    socket.on("new-join-request", handleNewJoinRequest);

    socket.emit("fetch-my-meets", { userId });
    if (userId) {
      socket.emit("user-connected", userId);
    }

    return () => {
      socket.off("room-exists", handleRoomExists);
      socket.off("room-not-exist", handleRoomNotExist);
      socket.off("meets-fetched", handleMeetsFetched);
      socket.off("new-join-request", handleNewJoinRequest);
    };
  }, [socket, router, userId, setMyMeets]);

  const acceptJoinRequest = (roomId, userId) => {
    socket.emit("accept-join-request", { roomId, userId });
    socket.emit("join-request-accepted", { roomId });

    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.targetUserId !== userId)
    );
    setPlaySound(false);
    router.push(`/meet/${roomId}`);
  };

  const denyJoinRequest = (roomId, userId) => {
    socket.emit("deny-join-request", { roomId, userId });
    socket.emit("join-request-denied", { roomId });

    setPlaySound(false);
    setAnimate(false);
    setJoinRequests((prevRequests) =>
      prevRequests.filter((request) => request.targetUserId !== userId)
    );
    setClosePopup(true);
  };

  // Render join requests
  const renderJoinRequests = () => {
    return (
      <>
        {!closePopup && joinRequests.length !== 0 ? (
          <div className="join-requests-popup">
            {joinRequests.map((request, index) => (
              <div key={index} className="join-request">
                <p>
                  Incoming call from <strong>{request.senderUsername}</strong>
                </p>
                <div className="flex justify-evenly">
                  <button
                    className={`phone-call-icon ${
                      animate ? "animate-bounce" : ""
                    }`}
                    onClick={() => acceptJoinRequest(request.roomId, userId)}
                  >
                    <BiSolidPhoneCall className="text-green-700" size={30} />
                  </button>
                  <button
                    onClick={() => denyJoinRequest(request.roomId, userId)}
                  >
                    <FcEndCall className="text-red-700" size={30} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <JoinRequestSound playSound={playSound} />
      </>
    );
  };

  return (
    <>
      <div className="homePage">
        <div className="homePage-hero">
          <div className="home-header">
            <div className="home-logo">
              <h2>Meet</h2>
            </div>

            {!userName || userName === "null" ? (
              <div className="header-before-login">
                <button onClick={handleLogIn}>login</button>
              </div>
            ) : (
              <div className="header-after-login">
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic">
                    {userName}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Link className="dropdown-options" href="/profile">
                        Profile
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropdown-options"
                      onClick={handleLogOut}
                    >
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            )}
          </div>

          <div className="container home-container">
            {!userName || userName === "null" ? (
              <div className="home-app-intro">
                <button onClick={handleLogIn}>Join Now..</button>
              </div>
            ) : (
              <>
                <div className="home-app-intro">
                  <span className="welcome">Welcome!! {userName},</span>
                </div>
                <div className="home-meet-container">
                  <div className="create-meet">
                    <input
                      type="text"
                      placeholder="Name your meet..."
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                    <Button onClick={handleShow}>
                      <RiVideoAddFill /> New meet
                    </Button>
                  </div>
                  <p>or</p>
                  <div className="join-meet">
                    <input
                      type="text"
                      placeholder="Enter code..."
                      onChange={(e) => setJoinRoomId(e.target.value)}
                    />
                    <button onClick={handleJoinRoom}>
                      <CgEnter /> Join Meet
                    </button>
                  </div>
                  <span>{joinRoomError}</span>
                </div>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Create New Meet</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="mb-3 form-floating ">
                      <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        required
                        placeholder="Name your meet"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                      />
                      <label htmlFor="floatingInput">Meet name</label>
                    </div>

                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => setNewMeetType(e.target.value)}
                    >
                      <option defaultValue>Choose meet type</option>
                      <option value="instant">Instant meet</option>
                      <option value="scheduled">Schedule for later</option>
                    </select>

                    {newMeetType === "scheduled" ? (
                      <>
                        <p
                          style={{
                            margin: " 10px 0px 0px 0px",
                            color: "rgb(2, 34, 58)",
                          }}
                        >
                          Meet Date:{" "}
                        </p>
                        <input
                          type="date"
                          className="form-control"
                          onChange={(e) => setNewMeetDate(e.target.value)}
                        />
                        <p
                          style={{
                            margin: " 10px 0px 0px 0px",
                            color: "rgb(2, 34, 58)",
                          }}
                        >
                          Meet Time:{" "}
                        </p>
                        <input
                          type="time"
                          className="form-control"
                          onChange={(e) => setNewMeetTime(e.target.value)}
                        />
                      </>
                    ) : (
                      ""
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateRoom}>
                      Create Meet
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            )}
          </div>
        </div>
      </div>
      {renderJoinRequests()}
    </>
  );
};

export default Home;
