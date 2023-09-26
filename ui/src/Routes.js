import React, { useContext } from 'react';
import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import { WorkSpaceProvider } from "./context/WorkSpaceContext";
import { AuthContext } from "./context/auth-context";
import ChatRoom from "./pages/ChatRoom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import AuthCheck from "./utils/AuthCheck";
import Callback from "./utils/CallBack";

const PrivateRoute = ({ component: Component, auth, user }) => (
  <Route
    render={(props) =>
      auth === true && user ? (
        <WorkSpaceProvider user={user}>
          <Component auth={auth} {...props} />
        </WorkSpaceProvider>
      ) : (
        <Redirect to={{ pathname: "/authcheck" }} />
      )
    }
  />
);

const Routes = () => {
  const context = useContext(AuthContext);
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/login" component={Login} />
          <Route path="/signUp" component={SignUp} />
          <Route path="/authcheck" component={AuthCheck} />
          <PrivateRoute
            path="/chatroom"
            auth={context.state.authenticated}
            user={context.state.user}
            component={ChatRoom}
          />
          <Route path="/callback" component={Callback} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;