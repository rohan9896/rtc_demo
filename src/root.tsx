import { Box, Button, Flex, IconButton } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import JitsiMeetRoom2 from "./JitsiMeetRoom2";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";
import { useEffect, useRef, useState } from "react";
import SideForm from "./components/SideForm";

const mergeAudioStreams = (
  desktopStream: MediaStream,
  voiceStream: MediaStream
) => {
  const context = new AudioContext();

  // Create a couple of sources
  const source1 = context.createMediaStreamSource(desktopStream);
  const source2 = context.createMediaStreamSource(voiceStream);
  const destination = context.createMediaStreamDestination();

  const desktopGain = context.createGain();
  const voiceGain = context.createGain();

  desktopGain.gain.value = 0.7;
  voiceGain.gain.value = 0.7;

  source1.connect(desktopGain).connect(destination);
  // Connect source2
  source2.connect(voiceGain).connect(destination);

  return destination.stream.getAudioTracks();
};

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

      const externalAudioSteam = await navigator.mediaDevices.getUserMedia({
        // audio: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // const videoStream = screenVideoStream.clone();
      // videoStream.addTrack(externalAudioSteam.getAudioTracks()[0]);

      // const mergedStream = new MediaStream();

      // console.log({ mergedStream });

      // screenVideoStream.getAudioTracks().forEach((track) => {
      //   mergedStream.addTrack(track);
      // });

      // screenVideoStream.getVideoTracks().forEach((track) => {
      //   mergedStream.addTrack(track);
      // });

      // externalAudioSteam.getAudioTracks().forEach((track) => {
      //   mergedStream.addTrack(track.clone());
      // });

      const mergedAudioStream = mergeAudioStreams(
        screenVideoStream,
        externalAudioSteam
      );

      const tracks = [
        ...screenVideoStream.getVideoTracks(),
        ...mergedAudioStream,
      ];

      console.log("Tracks to add to stream", tracks);
      const mergedStream = new MediaStream(tracks);

      if (mergedStream) {
        setStream(mergedStream);
      }
      recorderRef.current = new RecordRTC(mergedStream, {
        type: "video",
        numberOfAudioChannels: 2,
        timeSlice: 3000,
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
