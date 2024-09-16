import { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext"; // Your custom AuthContext
import SignIn from "../pages/SignIn";

type PrivateRouteProps = {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { currentUser } = useAuth();

  // If the user is logged in, render the children, otherwise redirect to login
  return currentUser ? <>{children}</> : <SignIn />;
};

export default PrivateRoute;