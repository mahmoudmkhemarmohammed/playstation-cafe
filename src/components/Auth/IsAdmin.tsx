import { useAppSelector } from "@store/hooks";
import { Navigate } from "react-router-dom";

const IsAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector((state) => state.auth);
  if (user?.role === "user") {
    return <Navigate to={"/devices"} />;
  }
  return <>{children}</>;
};

export default IsAdmin;
