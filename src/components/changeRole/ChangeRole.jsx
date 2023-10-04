import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, upgradeUser } from "../../redux/features/auth/authSlice";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";
import {
  EMAIL_RESET,
  sendAutomatedEmail,
} from "../../redux/features/email/emailSlice";
const ChangeRole = ({ id, email }) => {
  const { isLoading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState("");

  //change user role
  const changeRole = async (id) => {
    if (!userRole) {
      return toast.error("Please select a role");
    }
    const userData = {
      role: userRole,
      id: id,
    };

    const emailData = {
      subject: "Auth App: Account Role Changed",
      send_to: email,
      reply_to: "noreply@saira.com",
      template: "changeRole",
      url: "/login",
    };

    await dispatch(upgradeUser(userData));
    await dispatch(sendAutomatedEmail(emailData));
    await dispatch(getUsers());
    await dispatch(EMAIL_RESET());
  };

  return (
    <div className="sort">
      {isLoading && <Loader />}
      <form
        className="--flex-start"
        onSubmit={(e) => {
          e.preventDefault();
          changeRole(id);
        }}
      >
        <select
          name="changeRole"
          id="changeRole"
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
        >
          <option value="">-- select --</option>
          <option value="subscriber">Subscriber</option>
          <option value="author">Author</option>
          <option value="admin">Admin</option>
          <option value="suspended">Suspended</option>
        </select>
        <button type="submit" className="--btn --btn-primary">
          <FaCheck size={15} />
        </button>
      </form>
    </div>
  );
};

export default ChangeRole;
