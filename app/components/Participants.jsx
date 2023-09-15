"use client";

import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import axios from "axios";
import { useParams } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Participants = () => {
  const { id } = useParams();
  const { socket, participants, participantsListOpen } =
    useContext(SocketContext);

  const [users, setUsers] = useState();
  const [filteredUser, setFilteredUser] = useState();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("userName");

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/users`);
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    const filteredUsers = users?.filter((user) => !participants[user._id]);
    const filterCurrUser = filteredUsers?.filter((user) => user._id !== userId);
    setFilteredUser(filterCurrUser);
  }, [users, participants, userId]);

  const sendJoinRequest = (targetUserId) => {
    socket.emit("user-requested-to-join", {
      roomId: id,
      targetUserId,
      senderUserId: userId,
      senderUsername: username,
    });
  };

  return (
    <div
      className="participants-page"
      style={
        participantsListOpen
          ? { right: "1vw" }
          : { right: "-25vw", display: "none" }
      }
    >
      <h3>Members...</h3>
      <hr id="h3-hr" />
      <div className="participants-container">
        {Object.values(participants).length > 0
          ? Object.values(participants).map((member, index) => {
              return (
                <div key={index} className="participant">
                  <div className="participant-logo">
                    <p>{member.charAt(0).toUpperCase()}</p>
                  </div>
                  <h4>{member}</h4>
                </div>
              );
            })
          : null}

        <hr id="h3-hr" />

        {filteredUser?.map((user, index) => (
          <div key={index} className="relative flex mb-3 participant">
            <div className="flex items-center gap-2">
              <div className="participant-logo">
                <p>{user.username.charAt(0).toUpperCase()}</p>
              </div>
              <h4>{user.username}</h4>
            </div>
            <button
              onClick={() => sendJoinRequest(user._id)}
              className="absolute text-sm right-1"
            >
              invite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;
