"use client";

import { useContext } from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { SocketContext } from "../context/SocketContext";

const Video = () => {
  const { users, tracks } = useContext(SocketContext);

  console.log("usersssss:::", users);

  return (
    <div className="videoPlayer-page">
      <div
        className="videoplayer-video"
        style={
          users.length < 1
            ? { height: "72vh", width: "60vw" }
            : users.length === 1
            ? { height: "65vh", width: "45vw" }
            : {}
        }
      >
        <AgoraVideoPlayer
          id="video"
          style={
            users.length < 1
              ? { height: "71vh", width: "60vw" }
              : users.length === 1
              ? { height: "64vh", width: "45vw" }
              : {}
          }
          videoTrack={tracks[1]}
        />
        <p>You</p>
      </div>

      {users &&
        users.length > 0 &&
        users.map((user, i) => (
          <div
            key={i}
            className="videoplayer-video"
            style={users.length === 1 ? { height: "65vh", width: "45vw" } : {}}
          >
            <AgoraVideoPlayer
              id="video"
              videoTrack={user.videoTrack}
              key={user.uid}
              style={
                users.length === 1 ? { height: "64vh", width: "45vw" } : {}
              }
            />
            <p>{user.username}</p>
          </div>
        ))}
    </div>
  );
};

export default Video;
