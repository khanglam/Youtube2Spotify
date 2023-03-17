# Youtube2Spotify

Youtube2Spotify is a simple Python script that allows you to convert your Youtube playlists to Spotify playlists.

## Technologies Used

- Python 3
- Google's Youtube API
- Spotify's Web API
- Flask web framework
- OAuth 2.0 authentication protocol
- Netlify and Railway App cloud platform

## Features

- Allow users to Create a personal account for the app, which is password-encrypted using a variant of Blowfish encryption algorithm (bcrypt).
- Automatically imports all Youtube playlist videos into a Spotify playlist.
- Authenticates users through their Youtube and Spotify accounts using OAuth 2.0.
- Safely cache credentials for both YouTube and Spotify to reduce redundant authentications.
- Allows users to safely logout and revoke all access to their YouTube and Spotify accounts.
- Allows users to choose which Youtube playlist they want to import from.
- Allows users to choose which Spotify playlist they want to import to or to create new playlist if desired.
- User authentication to ensure privacy and security.
- Implemented functionalities to enhance the process of extracting songs information from YouTube, which can provide much higher accuracy than many existing Python libraries.
- Automatically skip deleted videos that may exist on the user's YouTube playlist.
- Graceful error handling

## Usage

1. Visit https://youtube2spotify.site/
2. Click the 'Login with Spotify' button and authenticate with your Spotify account
3. Click the 'Login with Youtube' button and authenticate with your Youtube account
4. Select the Youtube playlist you want to import
5. Click the 'Import' button and wait for the process to finish
6. View the list of skipped tracks, if any, and retry importing them if desired
   That's it! Enjoy your newly created Spotify playlist!

Disclaimer
This project is for demonstration purposes only and is not intended for commercial use. The project is provided as-is and the developer is not responsible for any issues or damages that may arise from its use.
