"use client";

import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../context/SocketContext.jsx";
import { config } from "../../AgoraSetup.js";
import Controls from "../../components/Controls.jsx";
import Participants from "../../components/Participants.jsx";
import { useParams } from "next/navigation";

const MeetRoom = () => {
  const { id } = useParams();
  const [roomName, setroomName] = useState("");

  const {
    socket,
    setInCall,
    client,
    users,
    setUsers,
    ready,
    tracks,
    setStart,
    participants,
    setParticipants,
    start,
  } = useContext(SocketContext);
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const VideoPlayer = dynamic(() => import("../../components/VideoPlayer"), {
    ssr: false,
  });

  useEffect(() => {
    socket.emit("join-room", { userId, roomId: id });
    socket.on("user-joined", async () => {
      setInCall(true);
    });
    socket.emit("get-participants", { roomId: id });
    socket.on("participants-list", async ({ usernames, roomName }) => {
      setParticipants(usernames);
      setroomName(roomName);
    });
  }, [socket]);

  useEffect(() => {
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          user.username = userName;
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        socket.emit("user-left-room", { userId: user.uid, roomId: id });
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      try {
        await client.join(config.appId, name, config.token, userId);
      } catch (error) {
        console.log("error");
      }

      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      try {
        init(id);
      } catch (error) {
        console.log(error);
      }
    }
  }, [id, client, ready, tracks, setUsers, setStart, socket, userId]);

  return (
    <div className="meetPage">
      <div className="meetPage-header">
        <h3>
          Meet: <span>{roomName}</span>
        </h3>
        <p>
          Meet Id: <span id="meet-id-copy">{id}</span>
        </p>
      </div>

      <Participants />

      <div className="meetPage-videoPlayer-container">
        {start ? <VideoPlayer tracks={tracks} users={users} /> : ""}
      </div>

      <div className="meetPage-controls-part">
        {ready && tracks && <Controls tracks={tracks} />}
      </div>
    </div>
  );
};

export default MeetRoom;
