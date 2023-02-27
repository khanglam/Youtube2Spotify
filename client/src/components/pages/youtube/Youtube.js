import { React, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Axios from '../../Axios';
import TransferPlaylist from './TransferPlaylist';

import { UserChannelInfo } from './UserChannel';

const LOGIN_URL = '/getYtChannel';
const CLEAR_YT_SESSION = '/logoutYt';

function Youtube() {
  const [userChannel, setUserChannel] = useState(null);

  // To toggle which option to render
  const [streamMusic, setStreamMusic] = useState(false);
  const [transferPlaylist, setTransferPlaylist] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.get(LOGIN_URL);
      if (response.data.includes('accounts.google')) {
        window.open(response.data, '_blank');
      } else setUserChannel(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  async function logoutYoutube() {
    try {
      const response = await Axios.get(CLEAR_YT_SESSION);
      console.log('Youtube Session Cleared');
      window.location = '/Youtube';
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
              <input
                value='Transfer Playlist'
                type='button'
                className='btn btn-danger btn-lg'
                onClick={() => {
                  setTransferPlaylist(true);
                }}
              ></input>
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
