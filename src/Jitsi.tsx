import RecordRTC, { invokeSaveAsDialog } from "recordrtc";
import JitsiMeetRoom2 from "./JitsiMeetRoom2";
import { useEffect, useRef, useState } from "react";

const Jitsi = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recorderRef = useRef<any>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  const refVideo = useRef<any>(null);

  const handleRecording = async () => {
    try {
      // let stream = new MediaStream();

      console.log("first");
      const screenVideoStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 1920,
          height: 1080,
          frameRate: 30,
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        // audio: true,
      });
      // .then(async (displayMediaStream) => {
      //   const [screenVideoTrack] = displayMediaStream.getVideoTracks();
      //   const externalAudioSteam = await navigator.mediaDevices
      //     .getUserMedia({ audio: true })
      //     .catch((e) => {
      //       throw e;
      //     });
      //   const [externalAudioTrack] = externalAudioSteam.getAudioTracks();

      //   stream = new MediaStream([screenVideoTrack, externalAudioTrack]);
      // });

      const externalAudioSteam = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // screenVideoStream.addTrack(externalAudioSteam.getAudioTracks()[0]);

      const videoStream = screenVideoStream.clone();
      videoStream.addTrack(externalAudioSteam.getAudioTracks()[0]);

      if (videoStream) {
        setStream(videoStream);
      }
      recorderRef.current = new RecordRTC(videoStream, {
        type: "video",
        ondataavailable: (blob) => {
          console.log({ blob });
        },
      });
      recorderRef.current?.startRecording();
    } catch (e) {
      console.log({ e });
    }
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob());
    });
  };

  const handleSave = () => {
    if (blob) {
      invokeSaveAsDialog(blob);
    }
  };

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }

    refVideo.current.srcObject = stream;
  }, [stream, refVideo]);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "white",
          padding: "1rem",
        }}
      >
        <img
          alt="logo"
          src="https://www.zopperinsurance.com/static/media/zopper_logo.7ee8cda1738ac3b8afe07952361c6f72.svg"
        />
        <div>
          <button onClick={handleRecording}>Start Recording</button>
          <button onClick={handleStop}>Stop Recording</button>
          <button onClick={handleSave}>Save Recording</button>
        </div>
      </div>
      <div style={{ height: "85vh", width: "100%" }}>
        {/* <JitsiMeetRoom roomName="exampleRoom" /> */}
        <JitsiMeetRoom2 roomName="RohanGuptaRoom" />
        {/* <JitsiMeeting
        // domain={"https://localhost:8443"}
        roomName="PleaseUseAGoodRoomName"
        configOverwrite={{
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        }}
        userInfo={{
          displayName: "rohan_gupta",
          email: "rohan.gupta@zopper.com",
        }}
        onApiReady={(externalApi) => {
          // here you can attach custom event listeners to the Jitsi Meet External API
          // you can also store it locally to execute commands
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = "400px";
        }}
      /> */}
      </div>
      {blob && (
        <video
          src={URL.createObjectURL(blob)}
          controls
          autoPlay
          ref={refVideo}
          style={{ width: "700px", margin: "1em" }}
        />
      )}
    </>
  );
};

export default Jitsi;
