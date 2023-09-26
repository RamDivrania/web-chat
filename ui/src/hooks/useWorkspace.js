import { useContext, useMemo } from "react";
import { WorkSpaceContext } from "../context/WorkSpaceContext";


const useWorkspace = () => {

    const workspace = useContext(WorkSpaceContext);
    const dateTimeFormat = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const {
      username,
      userId,
      fname,
      lname,
      direct_channels,
      public_channels,
      messageState,
      messageDispatch,
      channel,
      channelDispatch,
    } = workspace;
    const messages = useMemo(() => {
      return (
        messageState.map((msg) => {
          return {
            primary: `${msg?.user?.username} (${new Date(
              msg?.createdAt
            ).toLocaleString("de-DE", dateTimeFormat)})`,
            secondary: msg?.text,
            userId: msg?.userId,
          };
        }) || []
      );
    }, [messageState, dateTimeFormat]);

    return {
      username,
      userId,
      fname,
      lname,
      messages,
      direct_channels,
      public_channels,
      messageDispatch,
      channel,
      channelDispatch,
    };
}
export default useWorkspace;