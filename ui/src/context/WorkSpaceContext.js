import axios from 'axios';
import React, { createContext, useEffect, useReducer } from "react";
import channelReducer from "../reducers/channelReducer";
import messageReducer from "../reducers/messageReducer";
import { ENDPOINT } from "../utils/constants";

export const WorkSpaceContext = createContext();

const channelInitState = {
  name: "Public",
  id: "0",
};
const WorkSpaceProvider = ({ children, user }) => {
  const [messageState, messageDispatch] = useReducer(messageReducer, []);
  const [channel, channelDispatch] = useReducer(
    channelReducer,
    channelInitState
  );
  useEffect(() => {
    axios
      .get(`${ENDPOINT}messages/get_messages`, {
        params: { channelId: channel.id }, // getting Public channel messages by default
      })
      .then((res) => {
        messageDispatch({ type: "LOAD_MESSAGES", payload: res.data });
      });
  }, [channel, messageDispatch]);
  return (
    <WorkSpaceContext.Provider
      value={{
        ...user,
        messageState: messageState ? messageState : [],
        messageDispatch,
        channel,
        channelDispatch,
      }}
    >
      {children}
    </WorkSpaceContext.Provider>
  );
};

export { WorkSpaceProvider };
