import { useRecoilState } from "recoil";
import { authState } from "../state/authAtom";
import api from "../api/axios";

export default function useAuth() {
  const [auth, setAuth] = useRecoilState(authState);

  const saveAuth = ({ user, token }) => {
    setAuth({ user, token });

    try {
      localStorage.setItem("fh_token", token);
      localStorage.setItem("fh_user", JSON.stringify(user));
    } catch {}
  };

  const clearAuth = () => {
    setAuth({ user: null, token: null });

    try {
      localStorage.removeItem("fh_user");
      localStorage.removeItem("fh_token");
    } catch {}
  };

  const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });

    const { user, token } = res.data;
    saveAuth({ user: user, token: token });
    return res.data;
  };

  const register = async ({ name, email, password }) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { user, token } = res.data;
    saveAuth({ user: user, token: token });
    return res.data;
  };

  const logout = () => {
    clearAuth();
  };

  return {
    saveAuth,
    clearAuth,
    login,
    register,
    logout,
  };
}
