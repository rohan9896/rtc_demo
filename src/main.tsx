import React from "react";
import ReactDOM from "react-dom/client";
// import App from './App.tsx'
import "./index.css";
import { App, App2 } from "./App";
import { HMSRoomProvider } from "@100mslive/react-sdk";
import Jitsi from "./Jitsi";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HMSRoomProvider>
      {/* <App2 /> */}
      <Jitsi />
    </HMSRoomProvider>
  </React.StrictMode>
);
