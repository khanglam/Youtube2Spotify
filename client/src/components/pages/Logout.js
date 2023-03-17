import Axios from '../Axios';

const LOGOUT_URL = '/logout';
const CLEAR_SPOTIFY_CACHE = '/clearSpotifyCache';
const CLEAR_YT_SESSION = '/logoutYt';

const logOut = async () => {
  try {
    let res = await Axios.get(CLEAR_SPOTIFY_CACHE); // Revoke and clear Spotify Session
    res = await Axios.get(CLEAR_YT_SESSION); // Revoke and clear YT Session
    res = await Axios.post(LOGOUT_URL);
    console.log(res);
    window.location.href = '/';
  } catch (error) {
    console.log(error.message);
  }
};

export { logOut };
