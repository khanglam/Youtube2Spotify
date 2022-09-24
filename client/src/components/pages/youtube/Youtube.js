import { React, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { AxiosYT } from "../../Axios";
import TransferPlaylist from "./TransferPlaylist";

import { UserChannelInfo } from "./UserChannel";

const LOGIN_URL = "/getYtChannel";

function Youtube() {
  const [tokenInfo, setTokenInfo] = useState();
  const [userChannel, setUserChannel] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  // To toggle which option to render
  const [streamMusic, setStreamMusic] = useState(false);
  const [transferPlaylist, setTransferPlaylist] = useState(false);
  const [optionSelected, setOptionSelected] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AxiosYT.get(LOGIN_URL);
      setUserChannel(response.data);
      // setRefreshToken(response.data["refresh_token"]);
      // setExpiresIn(response.data["expires_in"]);
    } catch (error) {
      console.log(error);
      // window.location = "/Youtube";
    }
  };

  return (
    <>
      {/* If authenticated */}
      {userChannel ? (
        <Container
          style={{
            minHeight: "90vh",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          {!streamMusic && !transferPlaylist && (
            <>
              <input
                value='Stream Music'
                type='button'
                className='btn btn-danger btn-lg'
                onClick={() => {
                  setStreamMusic(true);
                }}
              ></input>
              <input
                value='Transfer Playlist'
                type='button'
                className='btn btn-danger btn-lg'
                onClick={() => {
                  setTransferPlaylist(true);
                }}
              ></input>
            </>
          )}

          {streamMusic && (
            <UserChannelInfo.Provider value={userChannel}>
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
            </UserChannelInfo.Provider>
          )}
          {transferPlaylist && (
            <UserChannelInfo.Provider value={userChannel}>
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
                    setTransferPlaylist(false);
                  }}
                ></input>
                <TransferPlaylist />
              </Container>
            </UserChannelInfo.Provider>
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
