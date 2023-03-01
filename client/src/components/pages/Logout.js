import Axios from '../Axios';

const LOGOUT_URL = '/logout';
const CLEAR_SPOTIFY_CACHE = '/clearSpotifyCache';
const CLEAR_YT_SESSION = '/logoutYt';

const logOut = async () => {
  try {
    let response = await Axios.get(CLEAR_SPOTIFY_CACHE); // Revoke and clear Spotify Session
    response = await Axios.get(CLEAR_YT_SESSION); // Revoke and clear YT Session
    response = await Axios.post(LOGOUT_URL);
    console.log(response);
    window.location.href = '/';
  } catch (error) {
    console.log(error.message);
  }
};

export { logOut };
