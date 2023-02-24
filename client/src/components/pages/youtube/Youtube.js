import { React, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { AxiosYT } from '../../Axios';
import TransferPlaylist from './TransferPlaylist';

import { UserChannelInfo } from './UserChannel';

const LOGIN_URL = '/getYtChannel';
const YT_CLIENT_ID = process.env.REACT_APP_YT_CLIENT_ID;
const YT_SCOPES = process.env.REACT_APP_YT_SCOPES;

function Youtube() {
  const [userChannel, setUserChannel] = useState(null);
  const [tokenClient, setTokenClient] = useState({});

  // To toggle which option to render
  const [streamMusic, setStreamMusic] = useState(false);
  const [transferPlaylist, setTransferPlaylist] = useState(false);

  useEffect(() => {
    // If we don't have this global google comment, the Linter will give compilation error
    /* global google */

    // Get and set tokenClient
    setTokenClient(
      google.accounts.oauth2.initTokenClient({
        client_id: YT_CLIENT_ID,
        scope: YT_SCOPES,
        callback: (tokenResponse) => {
          console.log(tokenResponse);
          // We now have access to a live token to use for ANY google API
          if (tokenResponse && tokenResponse.access_token) {
          }
        }
      })
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const response = await AxiosYT.get(LOGIN_URL);
      // setUserChannel(response.data);
      tokenClient.requestAccessToken();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* If authenticated */}
      {userChannel ? (
        <Container
          style={{
            minHeight: '90vh',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          {!streamMusic && !transferPlaylist && (
            <>
              {/* <input
                value="Stream Music"
                type="button"
                className="btn btn-danger btn-lg"
                onClick={() => {
                  setStreamMusic(true);
                }}
              ></input> */}
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

          {/* {streamMusic && (
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
          )} */}
          {transferPlaylist && (
            <UserChannelInfo.Provider value={userChannel}>
              <Container className='d-flex justify-content-center'>
                <input
                  type='button'
                  className='m-3 btn btn-danger'
                  value='Back'
                  style={{
                    maxHeight: '38px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
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
            minHeight: '90vh'
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
