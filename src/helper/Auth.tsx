import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectUserInfo } from "../store/userInfo";

// allowedRoles prop 타입 지정
interface AuthProps {
  allowedRoles: string[];
}

function Auth({ allowedRoles }: AuthProps) {
  const userInfo = useSelector(selectUserInfo);
  const location = useLocation();

  // userInfo.roles는 string[]이므로, includes로 직접 비교 가능
  const isAuthorized = userInfo.roles?.some((role: string) =>
    allowedRoles.includes(role)
  );

  return isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default Auth;
