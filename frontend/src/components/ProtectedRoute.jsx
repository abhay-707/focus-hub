import { Outlet, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../state/authAtom";

const ProtectedRoute = ({ children }) => {
  console.log("inside protected route");
  const auth = useRecoilValue(authState);
  console.log(auth);
  return auth.token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
