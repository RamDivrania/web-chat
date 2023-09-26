import { Button, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  submit: {
    margin: "1rem",
    marginTop: theme.spacing(8),
  },
}));

export default function Welcome() {
  const classes = useStyles();

  return (
    <div className={classes.paper}>
      <Grid container justifyContent="center" alignItems="center">
        <Typography variant="h4">Welcome to WebChat!</Typography>
      </Grid>
      <Grid>
        <Link to="/login">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
        </Link>
        <Link to="/signUp">
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            Register
          </Button>
        </Link>
      </Grid>
    </div>
  );
}
