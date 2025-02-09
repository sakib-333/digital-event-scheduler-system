import { useContext } from "react";
import { AuthContext } from "../../Provider/AuthContext";

const useAuthInfo = () => {
  const data = useContext(AuthContext);
  return { ...data };
};

export default useAuthInfo;
