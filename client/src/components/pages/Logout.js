import Axios from '../Axios';

const LOGOUT_URL = '/logout';

const LogOut = async () => {
  try {
    const res = await Axios.post(LOGOUT_URL);
    window.location.href = '/';
  } catch (error) {
    console.log(error.message);
  }
};

export { LogOut };
