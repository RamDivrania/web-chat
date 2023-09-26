import axios from 'axios';
import { ENDPOINT } from "./utils/constants";

export function addMessage(dispatch, data) {
  axios
    .post(`${ENDPOINT}messages/add_message`, {
      channelId: data.channelId,
      text: data.text,
      user: {
        userId: data.userId,
        username: data.username,
      },
    })
    .then((res) => {
      if (res.data.success)
        dispatch({ type: "ADD_MESSAGE", payload: res.data.message });
    })
    .catch((e) => console.log(e));
}