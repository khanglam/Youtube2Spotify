import { React, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Axios from "../../Axios";
import PlayListResult from "./PlayListResult";
import VideoResults from "./VideoResults";

// Spotify API
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  // clientId: "2acabd8b4233495ebcd8c55daeb602f0",
});

function TransferPlaylist() {
  const [allPlayLists, setAllPlaylists] = useState([]); // All Playlists in a given yt channel
  const [selectPlayList, setSelectPlayList] = useState(null); // Playlist that user clicked on
  const [choosenPlaylistItems, setChoosenPlaylistItems] = useState([]); // Songs in a given playlist ID
  const [extractedSongs, setExtractedSongs] = useState([]); // all_song_info from /getYtAlbumSongs ID

  // Spotify API Variables
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const [extractedSpotifyUri, setExtractedSpotifyUri] = useState([]); // List to contain Spotify URI after search

  function chooseAlbum(album) {
    setSelectPlayList(album);
    setAllPlaylists([]);
  }

  const transferPlaylistToSpotify = async (e) => {
    try {
      const response = await Axios.get("/loginSpotify");
      setAccessToken(response.data["access_token"]);
      setRefreshToken(response.data["refresh_token"]);
      setExpiresIn(response.data["expires_in"]);
    } catch (error) {
      console.log(error);
    }

    extractedSongs.map((item) => {
      if (item.track !== null && item.artist !== null) {
        spotifyApi.searchTracks(item.track + " " + item.artist).then((res) => {
          const uri = res.body.tracks.items[0].uri;
          const track = res.body.tracks.items[0].name;
          return {
            track: track,
            uri: uri,
            confidence: "high"
          };
        });
      } else {
        // If artist and song name is undefined, search by title
        setExtractedSpotifyUri(
          spotifyApi.searchTracks(item.video_title).then((res) => {
            const uri = res.body.tracks.items[0].uri;
            const track = res.body.tracks.items[0].name;
            return {
              track: track,
              uri: uri,
              confidence: "low"
            };
          })
        );
      }
    });
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [transferPlaylistToSpotify]); // Only get access when clicked on TransferPlaylist Button

  // Fetch Videos Within Playlist
  useEffect(() => {
    (async () => {
      try {
        if (!selectPlayList) return;

        const response = await Axios.get("/getYtAlbumSongs", {
          params: {
            playlistId: selectPlayList.playlistId
          }
        });
        console.log(response.data);
        setChoosenPlaylistItems(
          response.data.response.items.map((video) => {
            const videoThumbnail = video.snippet.thumbnails.high;
            return {
              // return for map
              title: video.snippet.title,
              thumbnail: videoThumbnail.url,
              videoId: video.id
            };
          })
        );
        setExtractedSongs(
          response.data.all_song_info.map((song) => {
            return {
              // return for map
              artist: song.artist,
              track: song.song_name,
              spotify_uri: song.spotify_uri,
              video_title: song.video_title,
              youtube_url: song.youtube_url
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectPlayList]); // Fetch everytime user clicks on new playlist

  // Fetch Playlist
  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get("/getYtPlaylist");
        setAllPlaylists(
          response.data.items.map((album) => {
            const albumThumbnail = album.snippet.thumbnails.high;
            return {
              // return for map
              title: album.snippet.title,
              thumbnail: albumThumbnail.url,
              playlistId: album.id
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []); // Only need to load this once

  return (
    <Container className='d-flex flex-column' style={{ height: "90vh" }}>
      <div className='flex-grow-1 my-2' style={{ overflowY: "auto" }}>
        {allPlayLists.map((album) => (
          <PlayListResult
            album={album}
            key={album.id}
            chooseAlbum={chooseAlbum}
          />
        ))}
        {selectPlayList && (
          <div
            className='text-center'
            style={{
              whiteSpace: "pre",
              fontFamily: "Comic Sans",
              fontSize: "25px"
            }}
          >
            {choosenPlaylistItems.map((video) => (
              <VideoResults
                video={video}
                key={video.id}
                // chooseAlbum={chooseAlbum}
              />
            ))}
          </div>
        )}
      </div>
      {selectPlayList && (
        <input
          type='button'
          className='btn btn-success'
          value='Transfer This Playlist to Spotify'
          style={{
            maxHeight: "38px",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center"
          }}
          onClick={() => {
            transferPlaylistToSpotify();
          }}
        ></input>
      )}
    </Container>
  );
}

export default TransferPlaylist;
