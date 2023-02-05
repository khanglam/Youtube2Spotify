import Axios from "../Axios";

const LOGOUT_URL = "/logout";
const logOut = async () => {
  try {
    const response = await Axios.post(LOGOUT_URL);
    console.log(response);
    window.location.href = "/";
  } catch (error) {
    console.log(error.message);
  }
};

export { logOut };
