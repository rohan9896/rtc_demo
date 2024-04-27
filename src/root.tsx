import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import JitsiMeetRoom2 from "./JitsiMeetRoom2";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";
import { useEffect, useRef, useState } from "react";
import SideForm from "./components/SideForm";

const Root = () => {
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
        timeSlice: 1000,
        ondataavailable: (blob) => {
          // send this blob to backend
          console.log({ blob }, "swdefreds");
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
        <Flex gap="0.3rem">
          <Button colorScheme="blue" onClick={handleRecording}>
            Start Recording
          </Button>
          <Button colorScheme="red" onClick={handleStop}>
            Stop Recording
          </Button>
          <IconButton
            colorScheme="blue"
            aria-label="Download"
            icon={<DownloadIcon />}
            onClick={handleSave}
          />
        </Flex>
      </div>
      <Flex>
        <Box flexBasis="40%">
          <SideForm />
        </Box>
        <Box flexBasis="60%">
          <JitsiMeetRoom2 roomName="RohanGuptaRoom" />
        </Box>
      </Flex>
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

export default Root;
