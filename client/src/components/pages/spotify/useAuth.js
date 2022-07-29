import React, { useEffect, useState } from "react";
import Axios from "../../Axios";

export default function useAuth() {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  const LOGIN_URL = "/loginSpotify";
  const REFRESH_URL = "/refreshSpotifyToken";

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await Axios.get(LOGIN_URL);
  //       console.log(response.data);
  //       setTokenInfo(response.data);
  //     } catch (error) {
  //       console.log(error);
  //       // window.location = "/Spotify";
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    (async () => {
      try {
        const response = await Axios.get(REFRESH_URL);
        console.log("From useAuth:" + response.data);
        setAccessToken(response.data["access_token"]);
        setExpiresIn(response.data["expires_in"]);
      } catch (error) {
        console.log(error);
      }
    })();
    return function cleanup() {
      // do something when unmount component
    };
  }, [accessToken]);

  return accessToken;
}
