import { React, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Axios from "../../Axios";

import { TokenInfo } from "./TokenInfo";

const LOGIN_URL = "/loginYoutube";

function Youtube() {
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
      window.location = "/Youtube";
    }
  };
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
                  className='btn btn-danger'
                  value='Back'
                  style={{
                    maxHeight: "38px",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                  onClick={() => {
                    setStreamMusic(false);
                  }}
                ></input>
              </Container>
            </TokenInfo.Provider>
          ) : (
            <input
              value='Stream Music'
              type='button'
              className='btn btn-danger btn-lg'
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
            minHeight: "90vh"
          }}
        >
          <input
            onClick={handleSubmit}
            className='btn btn-danger btn-lg'
            id='submit'
            name='submit'
            type='submit'
            value='Login With YouTube'
          ></input>
        </Container>
      )}
    </>
  );
}

export default Youtube;
