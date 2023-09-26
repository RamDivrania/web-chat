import { Container } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { addMessage } from "../Actions";
import ListView from "../components/ListView";
import RoomHeader from "../components/RoomHeader";
import useAuth from "../hooks/useAuth";
import useWorkspace from "../hooks/useWorkspace";
import { ENDPOINT } from "../utils/constants";

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarBottom: {
    top: "auto",
    bottom: 0,
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  paper: {
    paddingBottom: 50,
    width: "100%",
    marginTop: "3rem",
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  input: {
    backgroundColor: theme.palette.common.white,
  },
  sendButton: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  rightMessage: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
    "& div": {
      background: "yellowgreen",
      opacity: "0.9",
      padding: "1rem",
      borderRadius: "6px",
    },
  },
  leftMessage: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    "& div": {
      background: "#b3d4fc",
      opacity: "0.9",
      padding: "1rem",
      borderRadius: "6px",
    },
  },
}));

let socket;
const ChatRoom = () => {
  const dummyElement = useRef(null);
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [initialized, setInitialized] = useState(false);
  const {
    username,
    userId,
    fname,
    lname,
    messages,
    messageDispatch,
    channel,
    channelDispatch,
    direct_channels,
    public_channels,
  } = useWorkspace();
  socket = io(ENDPOINT);

  useEffect(() => {
    if (!initialized) {
      connectToRooms();
      getMessages();
      disconnect();
    }
  }, [direct_channels, public_channels, initialized]);

  useEffect(() => {
    dummyElement.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function connectToRooms() {
    const rooms = direct_channels
      .concat(public_channels)
      .map((chan) => chan.name);
    socket.emit("set rooms", rooms);
    setInitialized(true);
  }

  function getMessages() {
    socket.on("release new message", (message) => {
      const data = {
        channelId: message.channelId,
        text: message.secondary,
        userId: message.userId,
        createdAt: message.createdAt,
        user: {
          userId: message.userId,
          username: message.primary,
        },
      };
      if (message.primary !== username) {
        messageDispatch({ type: "ADD_MESSAGE", payload: data });
      }
    });

    socket.on("joined room", (message) => {
      channelDispatch({
        type: "CHANGE_CHANNEL",
        payload: { id: message.channelId, name: message.name },
      });
    });

    setInitialized(true);
  }

  function disconnect() {
    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        socket.connect();
      } //else it'll try to reconnect on its own.
    });
    setInitialized(true);
  }

  const sendMessage = () => {
    const data = {
      channelId: channel.id,
      text: message,
      room: channel.name,
      username,
      userId,
    };
    socket.emit("new message", data);
    addMessage(messageDispatch, data);
    setMessage("");
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const auth = useAuth();
  const handleChannelChange = (channel) => {
    const channelId = channel.id ? channel.id : "0";
    const joinRoomData = {
      id: channelId,
      room: channel.name,
      user: username,
    };
    socket.emit("leave room", channel.name); //should be old channel data
    socket.emit("join room", joinRoomData); //should be new channel data
  };
  return (
    <Container>
      <div className={classes.root}>
        <RoomHeader room={channel.name} />
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <Button> {fname || lname ? fname + " " + lname : username}</Button>
          <Divider />
          <ListView
            listHeaderText="Channels"
            data={public_channels}
            selectedChannel={channel.name}
            onClick={(channel) => {
              handleChannelChange(channel);
            }}
            isPublic={true}
          />
          <Divider />
          <ListView
            listHeaderText="Direct Messages"
            data={direct_channels}
            selectedChannel={channel.name}
            onClick={(channel) => {
              handleChannelChange(channel);
            }}
          />
        </Drawer>
        <Grid container>
          <Grid item xs={12}>
            <Paper square elevation={0} className={classes.paper}>
              <List>
                {messages &&
                  messages.map(({ primary, secondary, userId }, index) => (
                    <React.Fragment key={index}>
                      <ListItem
                        className={
                          userId === auth.currentUser()?.userId
                            ? classes.rightMessage
                            : classes.leftMessage
                        }
                      >
                        <ListItemText primary={primary} secondary={secondary} />
                      </ListItem>
                    </React.Fragment>
                  ))}
              </List>
              <div ref={dummyElement} />
            </Paper>
          </Grid>
        </Grid>
        <AppBar position="fixed" className={classes.appBarBottom}>
          <Toolbar>
            <div style={{ width: "90%" }}>
              <TextField
                fullWidth={true}
                id="message"
                label="Start typing"
                variant="filled"
                classes={{
                  root: classes.input,
                }}
                value={message}
                onChange={handleMessageChange}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
            </div>
            <IconButton
              aria-label="send-message"
              className={classes.sendButton}
              onClick={sendMessage}
              color="secondary"
            >
              <SendIcon fontSize="large" />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    </Container>
  );
};

export default ChatRoom;
