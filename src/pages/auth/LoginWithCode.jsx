import { GrInsecure } from "react-icons/gr";
import styles from "./auth.module.scss";
import Card from "../../components/card/Card";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  RESET,
  loginWithCode,
  sendLoginCode,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const LoginWithCode = () => {
  const [loginCode, setLoginCode] = useState("");

  const { email } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, isSuccess, isLoading } = useSelector(
    (state) => state.auth
  );

  const handleInputChange = (e) => {
    setLoginCode(e.target.value);
  };

  const sendUserLoginCode = async () => {
    await dispatch(sendLoginCode(email));
    await dispatch(RESET());
  };

  const loginUserWithCode = async (e) => {
    e.preventDefault();

    if (loginCode === "") {
      //console.log("error");
      toast.error("Please fill in the login code");
      return;
    }

    // Validate email
    if (loginCode.length !== 6) {
      //console.log("error");
      toast.error("Access code must be 6 characters");
      return;
    }

    const code = {
      loginCode,
    };
    await dispatch(loginWithCode({ code, email }));
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/profile");
      dispatch(RESET());
    }
  }, [isLoggedIn, isSuccess, dispatch, navigate]);

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <GrInsecure size={35} color="#999" />
          </div>
          <h2>Enter Access Code</h2>

          <form onSubmit={loginUserWithCode}>
            <input
              type="text"
              placeholder="Access Code"
              required
              name="loginCode"
              value={loginCode}
              onChange={handleInputChange}
            />

            <button type="submit" className="--btn --btn-primary --btn-block">
              Proceed To Login
            </button>
            <span className="--flex-center">
              Check your email for login access code
            </span>
            <div className={styles.links}>
              <p>
                <Link to="/">- Home</Link>
              </p>
              <p onClick={sendUserLoginCode} className="v-link --color-primary">
                <b>Resend Code</b>
              </p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default LoginWithCode;
