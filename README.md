# Youtube2Spotify

Youtube2Spotify is a web app that allows users to freely stream any Spotify songs, and convert their favorite Youtube playlists to a Spotify playlist. It uses the Youtube and Spotify API to retrieve the user's playlists and songs and allows them to transfer the songs to their Spotify account. <br>

This project is for demo purposes only and is not open for contribution. <br>
<u>Note</u>: Upon authentication for your Spotify and YouTube accounts, be assured that the authentication details are not stored anywhere in this application. You can trust that your credentials and access tokens are not saved, ensuring the security and privacy of your accounts.

## Technologies Used

- Python 3
- Google's Youtube API
- Spotify's Web API
- Lyrics Genius API
- Flask web framework
- OAuth 2.0 Authorization Code Flow Protocol
- Netlify and Railway App cloud platform

## Features

- Allow users to login/register a personal account for the app, which is password-encrypted using a variant of Blowfish encryption algorithm (bcrypt). Stored in a PostgreSQL database
- Provide simple to navigate UI to allow users to stream any Spotify songs, which also display lyrics via Lyrics Genius API.
- Automatically imports all Youtube playlist videos into a Spotify playlist.
- Authenticates users through their Youtube and Spotify accounts using OAuth 2.0 to ensure privacy and security.
- Safely cache credentials to reduce redundant authentication processes.
- Allows users to safely logout and revoke all access to their YouTube and Spotify accounts.
- Allows users to choose which Youtube playlist they want to import from.
- Allows users to choose which Spotify playlist they want to import to, or to create new playlist if desired.
- Implemented functionalities to enhance the process of extracting songs information from YouTube, which can provide much higher accuracy than many existing Python libraries.
- Automatically skip deleted videos that exists on user's YouTube playlists.
- Graceful error handling

## Usage

1. Visit https://youtube2spotify.site/
2. Login / Register a new account.
3. Navigate to Spotify Navbar and select the 'Login with Spotify' button and authenticate with your Spotify account.
4. Premium Spotify Users: Select 'Stream Music' if you wish to stream Spotify music.
5. Navigate to YouTube Navbar and select the 'Login with Youtube' button and authenticate with your Youtube account.
6. Select the Youtube playlist you want to import.
7. Click the 'Import' button and wait for the process to finish.

That's it! Enjoy your newly created Spotify playlist!

## Disclaimer
This project is for demonstration purposes only and is not intended for commercial use. The project is provided as-is and the developer is not responsible for any issues or damages that may arise from its use.
