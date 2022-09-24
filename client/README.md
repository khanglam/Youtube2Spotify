React
Axios
Bootstrap
GraphQL - Safely store access tokens (not implemented)
JWT Vs Session Cookie
OAuth vs Authentication - Spotify
Spotipy = library wrtiten in flask that helps us create/interact with Spotify API easier.
spotify-web-api-node = This is a library that helps us makes web spotify calls easier. Spotipy version in react
react-spotify-web-playback = React library that aids with spotify streaming/playback functionalities.
lyricsFinder - React Library to fetch lyrics for songs - unused
lyric genius - Flask Import to fetch lyrics for songs

Youtube Data API
import pickle #library to store/load bytes file
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

Problems faced:
-Lots of CORS Issues with YouTube Data API, some of which was due to withCredentials being set to true. To solve this, we needed to make another instance of axios that handles axios create without withCredentials.
