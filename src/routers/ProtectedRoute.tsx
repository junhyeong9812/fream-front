import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/global/context/AuthContext";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    alert("로그인을 하셔야 이용하실 수 있습니다.");
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
