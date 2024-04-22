import { JitsiMeeting } from "@jitsi/react-sdk";
import React from "react";

const JitsiMeetRoom2: React.FC<{ roomName: string }> = ({ roomName }) => {
  return (
    <JitsiMeeting
      domain={"plvc-dev-back.theblackswan.in"}
      // domain="localhost:8443"
      roomName={roomName}
      configOverwrite={{
        startWithAudioMuted: false,
        disableModeratorIndicator: false,
        startScreenSharing: true,
        enableEmailInStats: false,
        prejoinPageEnabled: false, // Disable prejoin screen (if desired)
        disableTileView: false,
      }}
      interfaceConfigOverwrite={{
        APP_NAME: "Rohan Meet",
        // JITSI_WATERMARK_LINK: "https://mail.google.com/",
        // DEFAULT_BACKGROUND: "#1a3e7b",
        // VIDEO_LAYOUT_FIT: "both",
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      }}
      userInfo={{
        displayName: "Rohan Gupta",
        email: "rohan.gupta@zopper.com",
      }}
      onApiReady={(_) => {
        // here you can attach custom event listeners to the Jitsi Meet External API
        // you can also store it locally to execute commands
        // externalApi.
        // externalApi.executeCommand('toggle')
      }}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = "800px";
      }}
    />
  );
};

export default JitsiMeetRoom2;
