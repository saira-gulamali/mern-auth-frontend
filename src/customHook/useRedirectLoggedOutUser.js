import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../redux/features/auth/authService";
import { toast } from "react-toastify";

const useRedirectLoggedOutUser = (path) => {
  const navigate = useNavigate();

  useEffect(() => {
    let isLoggedIn;

    const redirectLoggedOutUser = async () => {
      try {
        isLoggedIn = await authService.loginStatus();
      } catch (error) {
        console.log(error.message);
      }
      if (!isLoggedIn) {
        toast.info("Login session expired. Please login to continue");
        navigate(path);
      }
      return;
    };
    redirectLoggedOutUser();
  }, [path, navigate]);
};

export default useRedirectLoggedOutUser;
