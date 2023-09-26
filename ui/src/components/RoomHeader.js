import { makeStyles } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import React from "react";
import useAuth from "../hooks/useAuth";

const drawerWidth = 300;
const useStyles = makeStyles(() => ({
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  header: {
    justifyContent: "space-between",
  },
}));

const RoomHeader = ({ room }) => {
  const classes = useStyles();
  const auth = useAuth();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.header}>
        <Typography align="center" variant="h6" noWrap>
          {room}
        </Typography>
        <IconButton onClick={() => auth.logout()}>
          <ExitToAppIcon color="secondary" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default RoomHeader;
