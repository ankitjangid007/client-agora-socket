import React, { useEffect, useRef } from "react";

const JoinRequestSound = ({ playSound }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (playSound) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [playSound]);

  return (
    <audio ref={audioRef} hidden>
      <source src="/gangsta-paradise-coolio-60778.mp3" type="audio/mpeg" />
    </audio>
  );
};

export default JoinRequestSound;
