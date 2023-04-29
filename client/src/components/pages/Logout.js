import Axios from '../Axios';

const LOGOUT_URL = '/logout';
const CLEAR_SPOTIFY_CACHE = '/clearSpotifyCache';
const CLEAR_YT_SESSION = '/logoutYt';

const logOut = async () => {
  try {
    const res = await Axios.post(LOGOUT_URL);
    window.location.href = '/';
  } catch (error) {
    console.log(error.message);
  }
};

export { logOut };
