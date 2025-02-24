import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "src/global/context/AuthContext";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500); // 500ms 딜레이 (로컬스토리지 체크를 기다리기 위함)
  }, []);

  if (loading) return null; // 로딩 중에는 아무것도 렌더링하지 않음

  if (!isLoggedIn) {
    alert("로그인을 하셔야 이용하실 수 있습니다.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
