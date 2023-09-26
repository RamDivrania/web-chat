import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import useAuth from "../hooks/useAuth";
import { useRouter } from "../hooks/useRouter";

const AuthCheck = () => {
  const context = useContext(AuthContext);
  const { state, dispatch } = context;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuthenticated()) {
      dispatch({ state, type: "AUTHENTICATE_SUCCESS" });
      router.push("/chatroom");
    } else {
      dispatch({ type: "AUTHENTICATE_FAIL" });
      router.push("/login");
    }
  }, [auth, dispatch, router, state]);

  return null;
};

export default AuthCheck;
