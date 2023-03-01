import { React, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Axios from '../../Axios';
import TransferPlaylist from './TransferPlaylist';

import { UserChannelInfo } from './UserChannel';

const LOGIN_URL = '/getYtChannel';
const CLEAR_YT_SESSION = '/logoutYt';

function Youtube() {
  const [userChannel, setUserChannel] = useState(null);
  const [errorWarning, setErrorWarning] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // To toggle which option to render
  const [streamMusic, setStreamMusic] = useState(false);
  const [transferPlaylist, setTransferPlaylist] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.get(LOGIN_URL);
      if (response.data.includes('accounts.google')) {
        window.open(response.data, '_blank');
      } else if (response.data == 'Not An Eligible Youtube Account') {
        setErrorWarning(
          <>
            It appears that your Google Account is not associated with YouTube.
            Please check and relog with another Google account.
            <br />
            Note: After authentication, if there is an option to select YouTube
            account, please select that instead.
          </>
        );
        setUserChannel('dummy data');
      } else {
        setUserChannel(response.data);
        setSuccessMessage(response.data);
      }
    } catch (error) {
      console.log(
        'Your Account is not associated with YouTube. Please check and relog with another Google account. ' +
          'After authentication, if there is an option to select YouTube account, please select that instead.'
      );
    }
  };
  async function logoutYoutube() {
    try {
      const response = await Axios.get(CLEAR_YT_SESSION);
      window.location = '/Youtube';
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
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
              {errorWarning && (
                <div class='alert alert-danger'>{errorWarning}</div>
              )}
              {successMessage && (
                <div class='alert alert-success'>Hello, {successMessage}</div>
              )}
              {!errorWarning && (
                <input
                  value='Transfer Playlist'
                  type='button'
                  className='btn btn-danger btn-lg'
                  onClick={() => {
                    setTransferPlaylist(true);
                  }}
                ></input>
              )}
              <input
                value='Logout'
                type='button'
                className='btn btn-danger btn-lg'
                onClick={() => {
                  logoutYoutube();
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
