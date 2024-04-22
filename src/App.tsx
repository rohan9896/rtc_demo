import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import RecordRTC, { invokeSaveAsDialog } from "recordrtc";

export function App2() {
  return <>vfgbhjnmkjnhbg</>;
}

export function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [stream2, setStream2] = useState<MediaStream | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blob2, setBlob2] = useState<Blob | null>(null);
  const refVideo = useRef<any>(null);
  const refVideo2 = useRef<any>(null);
  const recorderRef = useRef<any>(null);
  const recorder2Ref = useRef<any>(null);

  const handleRecording = async () => {
    try {
      console.log("first");
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: 1920,
          height: 1080,
          frameRate: 30,
        },
        // audio: {
        //   echoCancellation: true,
        //   noiseSuppression: true,
        // },
        audio: true,
      });

      const audioSteam = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // const videoStream = await navigator.mediaDevices.getUserMedia({
      //   video: {
      //     width: 1920,
      //     height: 1080,
      //     frameRate: 30,
      //   },
      //   audio: true,
      // });

      console.log("second");

      mediaStream.addTrack(audioSteam.getAudioTracks()[0]);

      if (mediaStream) {
        console.log(mediaStream);
        setStream(mediaStream);
      }
      if (audioSteam) {
        setStream2(audioSteam);
      }
      recorderRef.current = new RecordRTC(mediaStream, { type: "video" });
      recorder2Ref.current = new RecordRTC(audioSteam, { type: "audio" });
      recorderRef.current?.startRecording();
      recorder2Ref.current?.startRecording();
    } catch (e) {
      console.log({ e });
    }
    // const cameraStream = await navigator.mediaDevices.getUserMedia({
    //   video: true,
    //   audio: true,
    // });
  };

  const handleStop = () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob());
    });
    recorder2Ref.current.stopRecording(() => {
      setBlob2(recorder2Ref.current.getBlob());
    });
  };

  const handleSave = () => {
    if (blob) invokeSaveAsDialog(blob);
    if (blob2) invokeSaveAsDialog(blob2);
  };

  useEffect(() => {
    if (!refVideo.current) {
      return;
    }

    refVideo.current.srcObject = stream;
  }, [stream, refVideo]);

  useEffect(() => {
    if (!refVideo2.current) {
      return;
    }

    refVideo2.current.srcObject = stream2;
  }, [stream, refVideo2]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="App">
        <header className="App-header">
          <button className="button-1" onClick={handleRecording}>
            start
          </button>
          <button className="button-1" onClick={handleStop}>
            stop
          </button>
          <button className="button-1" onClick={handleSave}>
            save
          </button>
          {blob && (
            <video
              src={URL.createObjectURL(blob)}
              controls
              autoPlay
              ref={refVideo}
              style={{ width: "700px", margin: "1em" }}
            />
          )}
          {blob2 && (
            <audio
              src={URL.createObjectURL(blob2)}
              ref={refVideo2}
              controls
              autoPlay
              style={{ width: "700px", margin: "1em" }}
            />
          )}
        </header>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
