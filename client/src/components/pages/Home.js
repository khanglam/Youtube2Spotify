import React from 'react';

function Home() {
  return (
    <>
      <h1>Youtube2Spotify</h1>
      <p>
        Are you tired of manually transferring songs from YouTube to Spotify?
        With Youtube2Spotify, you can easily move entire playlists with just a
        few clicks. You'll enjoy the convenience of OAuth 2.0 authentication for
        added security. I appreciate any feedback you have to offer, so give it
        a try and let me know your thoughts!
      </p>
      <h2>Technologies Used</h2>
      <ul>
        <li>Python 3</li>
        <li>Google's Youtube API</li>
        <li>Spotify's Web API</li>
        <li>Lyrics Genius API</li>
        <li>Flask web framework</li>
        <li>OAuth 2.0 Authorization Code Flow Protocol</li>
        <li>Netlify and Railway App cloud platform</li>
      </ul>
      <h2>Features</h2>
      <ul>
        <li>
          Allow users to login/register a personal account for the app, which is
          password-encrypted using a variant of Blowfish encryption algorithm
          (bcrypt). Stored in a PostgreSQL database
        </li>
        <li>
          Provide simple to navigate UI to allow users to stream any Spotify
          songs, which also display lyrics via Lyrics Genius API.
        </li>
        <li>
          Automatically imports all Youtube playlist videos into a Spotify
          playlist.
        </li>
        <li>
          Authenticates users through their Youtube and Spotify accounts using
          OAuth 2.0 to ensure privacy and security.
        </li>
        <li>
          Safely cache credentials to reduce redundant authentication processes.
        </li>
        <li>
          Allows users to safely logout and revoke all access to their YouTube
          and Spotify accounts.
        </li>
        <li>
          Allows users to choose which Youtube playlist they want to import
          from.
        </li>
        <li>
          Allows users to choose which Spotify playlist they want to import to,
          or to create new playlist if desired.
        </li>
        <li>
          Implemented functionalities to enhance the process of extracting songs
          information from YouTube, which can provide much higher accuracy than
          many existing Python libraries.
        </li>
        <li>
          Automatically skip deleted videos that exists on user's YouTube
          playlists.
        </li>
        <li>Graceful error handling.</li>
      </ul>
      <h2>Usage</h2>
      <ol>
        <li>Login / Register a new account.</li>
        <li>
          Navigate to Spotify and select the 'Login with Spotify' button to
          authenticate your Spotify account. <br />
          <u>Note</u>: It is <b>important</b> that you login with Spotify first
          before attempting to transfer YouTube playlist to avoid authentication
          issues.
        </li>
        <li>
          Premium Spotify Users: Select 'Stream Music' if you wish to stream
          Spotify music.
        </li>
        <li>
          Navigate to YouTube and select the 'Login with Youtube' button to
          authenticate your YouTube account.
        </li>
        <li>
          Select the Youtube playlist you want to import.
          <br />
          <u>Note</u>: Depending on how large your playlist is, it may take some
          time for the backend to try its best to parse each videos into
          searchable Spotify songs. Please be patient :D
        </li>
        <li>Click the 'Import' button and wait for the process to finish.</li>
      </ol>
      <p>That's it! Enjoy your newly created Spotify playlist!</p>
    </>
  );
}

export default Home;
