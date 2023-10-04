import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/v1/users/`;
//console.log(BACKEND_URL);
//console.log(API_URL);

// Validate email
export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);

  return response.data;
};

// Logout user
const logout = async () => {
  const response = await axios.get(API_URL + "logout");

  return response.data.message;
};

// Get login status
const loginStatus = async () => {
  const response = await axios.get(API_URL + "loginStatus");

  return response.data;
};

// Get user profile
const getUser = async () => {
  const response = await axios.get(API_URL + "getUser");

  return response.data;
};

// Update profile
const updateUser = async (userData) => {
  const response = await axios.patch(API_URL + "updateUser", userData);

  return response.data;
};

// Send verification email
const sendVerificationEmail = async () => {
  const response = await axios.post(API_URL + "sendVerificationEmail");
  console.log("verification email response", response);
  return response.data.message;
};

// verify user
const verifyUser = async (verificationToken) => {
  const response = await axios.patch(
    `${API_URL}verifyUser/${verificationToken}`
  );

  return response.data.message;
};

// Change password
const changePassword = async (userData) => {
  const response = await axios.patch(API_URL + "changePassword", userData);

  return response.data.message;
};

// Forgot password
const forgotPassword = async (userData) => {
  const response = await axios.post(API_URL + "forgotPassword", userData);

  return response.data.message;
};

// reset password
const resetPassword = async (userData, resetToken) => {
  const response = await axios.patch(
    `${API_URL}resetPassword/${resetToken}`,
    userData
  );

  return response.data.message;
};

// get users
const getUsers = async () => {
  const response = await axios.get(`${API_URL}getUsers`);

  return response.data;
};

// delete user
const deleteUser = async (id) => {
  const response = await axios.delete(API_URL + id);

  return response.data.message;
};

// upgrade user
const upgradeUser = async (userData) => {
  const response = await axios.patch(API_URL + "upgradeUser", userData);

  return response.data.message;
};

// send login code
const sendLoginCode = async (email) => {
  const response = await axios.post(`${API_URL}sendLoginCode/${email}`);

  return response.data.message;
};

// login with code
const loginWithCode = async (code, email) => {
  const response = await axios.post(`${API_URL}loginWithCode/${email}`, code);

  return response.data;
};

// login with google
const loginWithGoogle = async (userToken) => {
  const response = await axios.post(`${API_URL}google/callback`, userToken);

  return response.data;
};

const authService = {
  register,
  login,
  logout,
  loginStatus,
  getUser,
  updateUser,
  sendVerificationEmail,
  verifyUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  upgradeUser,
  sendLoginCode,
  loginWithCode,
  loginWithGoogle,
};

export default authService;
