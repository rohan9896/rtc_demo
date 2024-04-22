import React, { useRef, useEffect } from "react";

interface JitsiMeetRoomProps {
  roomName: string;
}

const JitsiMeetRoom: React.FC<JitsiMeetRoomProps> = ({ roomName }) => {
  const jitsiContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadJitsiMeetScript = async () => {
      const script = document.createElement("script");
      script.src = "https://localhost:8443/external_api.js"; // Replace with your Jitsi Meet domain
      script.async = true;
      script.onload = () => {
        const domain = "localhost:8443"; // Your Jitsi Meet domain
        const options = {
          roomName: roomName,
          parentNode: jitsiContainer.current!,
          configOverwrite: {},
          interfaceConfigOverwrite: {},
        };

        new window.JitsiMeetExternalAPI(domain, options);
      };
      document.body.appendChild(script);
    };

    loadJitsiMeetScript();

    return () => {
      // Clean up if needed
    };
  }, [roomName]);

  return <div ref={jitsiContainer} style={{ height: "100%", width: "100%" }} />;
};

export default JitsiMeetRoom;
