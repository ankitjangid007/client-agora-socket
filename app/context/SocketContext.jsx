"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import socketIoClient, { io } from "socket.io-client";
import { useClient, useMicrophoneAndCameraTracks } from "../AgoraSetup";

export const SocketContext = createContext();

const WS = process.env.NEXT_PUBLIC_BASE_URL;

const socket = socketIoClient(WS);

export const SocketContextProvider = ({ children }) => {
  const router = useRouter();
  const userId = localStorage.getItem("userId");

  const [inCall, setInCall] = useState(false);
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const [screenTrack, setScreenTrack] = useState(null);

  const [participants, setParticipants] = useState({});

  const [myMeets, setMyMeets] = useState([]);

  const [participantsListOpen, setParticipantsListOpen] = useState(false);
  const [chatsContainerOpen, setChatsContainerOpen] = useState(false);

  const [newMeetType, setNewMeetType] = useState("");

  useEffect(() => {
    socket.on("room-created", ({ roomId, meetType }) => {
      if (meetType === "instant") {
        router.push(`/meet/${roomId}`);
      } else if (meetType === "scheduled") {
        router.push(`/profile`);
      }
    });
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        myMeets,
        setMyMeets,
        newMeetType,
        setNewMeetType,
        participants,
        setParticipants,
        userId,
        socket,
        inCall,
        setInCall,
        ready,
        tracks,
        screenTrack,
        setScreenTrack,
        client,
        users,
        setUsers,
        start,
        setStart,
        participantsListOpen,
        setParticipantsListOpen,
        chatsContainerOpen,
        setChatsContainerOpen,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
