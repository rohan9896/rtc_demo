// import { useHMSActions } from "@100mslive/react-sdk";
import React, { useState } from "react";

const JoinRoom = () => {
  // const hmsActions = useHMSActions();

  const [inputValues, setInputValues] = useState({
    name: "",
    token: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prevVal) => ({
      ...prevVal,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   console.log(e);
  //   // const { name = "", token = "" } = inputValues;
  //   // const {} = e.target.e

  //   const token = "";
  //   const name = "";

  //   const authToken = await hmsActions.getAuthTokenByRoomCode({
  //     roomCode: token,
  //   });

  //   try {
  //     await hmsActions.join({
  //       userName: name,
  //       authToken: authToken,
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <div>
      <form>
        <h2>Join Room</h2>
        <div>
          <input
            required
            id="name"
            type="text"
            name="name"
            value={inputValues.name}
            onChange={handleInputChange}
            placeholder="Your Name"
          />
        </div>
        <div>
          <input
            required
            id="room-code"
            type="text"
            name="roomCode"
            onChange={handleInputChange}
            placeholder="Room Code"
          />
        </div>
      </form>
    </div>
  );
};

export default JoinRoom;
