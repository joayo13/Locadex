import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Your custom AuthContext

type PrivateRouteProps = {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { currentUser } = useAuth();

  // If the user is logged in, render the children, otherwise redirect to login
  return currentUser ? <>{children}</> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;