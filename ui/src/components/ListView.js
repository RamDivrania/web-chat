import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import React, { useCallback, useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";
import useAuth from "../hooks/useAuth";
import { ENDPOINT } from "../utils/constants";

const ListView = ({
  listHeaderText,
  data,
  selectedChannel,
  onClick,
  isPublic,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [users, setUsers] = useState([]);
  const authContext = useContext(AuthContext);
  const auth = useAuth();
  const handleClick = (e) => {
    getAvailableUsers();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const itemClick = async (event) => {
    const targetUser =
      users.find((user) => user.id == event.currentTarget.dataset.myValue) ||
      {};
    const currentUser = authContext?.state?.user;
    const payload = {
      channelName: `${targetUser?.fname} ${targetUser?.lname} < > ${currentUser?.fname} ${currentUser?.lname} `,
      targetUser: event.currentTarget.dataset.myValue,
      currentUser: currentUser?.userId,
    };
    await axios.post(`${ENDPOINT}users/add_user_channel`, payload);
    auth.logout();
    handleClose();
  };

  const getAvailableUsers = useCallback(() => {
    if (!isPublic) {
      axios
        .get(`${ENDPOINT}users/new_chat_users`, {
          params: { userId: authContext?.state?.user?.userId },
        })
        .then((res) => {
          setUsers(res?.data?.payload);
        });
    }
  }, [authContext, isPublic]);

  return (
    <List
      component="nav"
      aria-labelledby="channel-List"
      subheader={
        <ListSubheader component="div" id="nested-list-channels">
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography>{listHeaderText}</Typography>
            </Grid>
            {!isPublic && (
              <Grid item>
                <IconButton onClick={handleClick} title="Start new chat">
                  <AddIcon fontSize="small" />
                </IconButton>
                {users.length > 0 && (
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    {users?.map((user) => (
                      <MenuItem
                        data-my-value={user?.id}
                        onClick={itemClick}
                        key={user?.id}
                        value={user?.fname + " " + user?.lname}
                      >
                        {user?.fname + " " + user?.lname}
                      </MenuItem>
                    ))}
                  </Menu>
                )}
              </Grid>
            )}
          </Grid>
        </ListSubheader>
      }
    >
      {data &&
        data?.map((channel, index) => (
          <ListItem
            button
            key={index}
            selected={selectedChannel === channel.name}
            onClick={() => onClick(channel)}
          >
            <ListItemText primary={channel.name} />
          </ListItem>
        ))}
    </List>
  );
};

export default ListView;
