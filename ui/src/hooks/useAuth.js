import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { ENDPOINT } from "../utils/constants";
import { useRouter } from "./useRouter";

function useAuth() {
  const router = useRouter();
  const context = useContext(AuthContext);
  const { dispatch } = context;

  const currentUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user || {};
  };

  const handleAuth = () => {
    if (localStorage.getItem("user") !== null) {
      const expiresAt = JSON.stringify(3600 * 1000 + new Date().getTime());
      localStorage.setItem("expiresAt", expiresAt);
      router.push("/authcheck");
    } else {
      console.log("error");
    }
  };

  const isAuthenticated = () => {
    const expiresAt = JSON.parse(localStorage.getItem("expiresAt"));
    const user = JSON.parse(localStorage.getItem("user"));
    if (expiresAt != null && user) {
      return new Date().getTime() < expiresAt;
    }
    return false;
  };

  const login = (username, password) => {
    axios
      .post(`${ENDPOINT}users/authenticate`, {
        username,
        password,
      })
      .then((response) => {
        const { data } = response;
        if (data.authenticated) {
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          router.push("/callback");
        }
      })
      .catch((err) => console.log(err));
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("expiresAt");
    router.push("/authcheck");
  };

  const signUp = (username, password, fname, lname) => {
    axios
      .post(`${ENDPOINT}users/signUp`, {
        username,
        password,
        fname,
        lname,
      })
      .then((response) => {
        const { data } = response;
        if (data.authenticated) {
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          router.push("/callback");
        }
      })
      .catch((err) => console.log(err));
  };

  return {
    currentUser,
    handleAuth,
    isAuthenticated,
    login,
    logout,
    signUp,
  };
}

export default useAuth;
