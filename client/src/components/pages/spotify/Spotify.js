import { React, useState, useEffect } from "react";

import { Container } from "react-bootstrap";
import useAuth from "./useAuth";
import Axios from "../../Axios";
import StreamMusic from "./StreamMusic";
import { TokenInfo } from "./TokenInfo";

const LOGIN_URL = "/loginSpotify";
const REFRESH_TOKEN_URL = "/refreshSpotifyToken";

function Spotify() {
  const [authUrl, setAuthURL] = useState(null);
  const [tokenInfo, setTokenInfo] = useState();
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  // To toggle which option to render
  const [streamMusic, setStreamMusic] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.get(LOGIN_URL);
      setTokenInfo(response.data);
      setAccessToken(response.data["access_token"]);
      setRefreshToken(response.data["refresh_token"]);
      setExpiresIn(response.data["expires_in"]);
    } catch (error) {
      console.log(error);
      window.location = "/Spotify";
    }
  };

  // Refresh Token Hook
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const timeout = setTimeout(() => {
      (async () => {
        try {
          const response = await Axios.get(REFRESH_TOKEN_URL);
          setTokenInfo(response.data);
          setAccessToken(response.data["access_token"]);
          setRefreshToken(response.data["refresh_token"]);
          setExpiresIn(response.data["expires_in"]);
          console.log("Token Refreshed");
        } catch (error) {
          console.log(error);
        }
      })();
    }, (expiresIn - 60) * 1000);

    return function cleanup() {
      clearTimeout(timeout);
    };
  }, [accessToken]);

  return (
    <>
      {tokenInfo ? (
        <Container
          className='d-flex justify-content-center align-items-center'
          style={{ minHeight: "90vh" }}
        >
          {streamMusic ? (
            <TokenInfo.Provider value={tokenInfo}>
              <Container className='d-flex justify-content-center'>
                <input
                  type='button'
                  className='btn btn-success'
                  value='Back'
                  style={{
                    maxHeight: "38px",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    setStreamMusic(false);
                  }}
                ></input>
                <StreamMusic />
              </Container>
            </TokenInfo.Provider>
          ) : (
            <input
              value='Stream Music'
              type='button'
              className='btn btn-success btn-lg'
              onClick={() => {
                setStreamMusic(true);
              }}
            ></input>
          )}
        </Container>
      ) : (
        <Container
          className='d-flex justify-content-center align-items-center'
          style={{
            minHeight: "90vh",
          }}
        >
          <input
            onClick={handleSubmit}
            className='btn btn-success btn-lg'
            id='submit'
            name='submit'
            type='submit'
            value='Login With Spotify'
          ></input>
        </Container>
      )}
    </>
  );
}

export default Spotify;
