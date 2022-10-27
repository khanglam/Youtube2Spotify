import { React, useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Axios from "../../Axios";
import PlayListResult from "./PlayListResult";
import VideoResults from "./VideoResults";
import TransferModal from "./TransferModal";

// Spotify API
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  // clientId: "2acabd8b4233495ebcd8c55daeb602f0",
});

function TransferPlaylist() {
  const [allPlayLists, setAllPlaylists] = useState([]); // All Playlists in a given yt channel
  const [selectedPlayList, setSelectPlayList] = useState(null); // Playlist that user clicked on
  const [choosenPlaylistItems, setChoosenPlaylistItems] = useState([]); // Songs in a given playlist ID
  const [extractedSongs, setExtractedSongs] = useState([]); // all_song_info within a specific Album (from /getYtAlbumSongs ID)

  // Spotify API Variables
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const [extractedSpotifyUri, setExtractedSpotifyUri] = useState([]); // Extracted Spotify Song List URI after Yt -> Spotify conversion

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
    setExtractedSpotifyUri(
      extractedSongs.map((item) => {
        if (item.track !== null && item.artist !== null) {
          spotifyApi
            .searchTracks(item.track + " " + item.artist)
            .then((res) => {
              const uri = res.body.tracks.items[0].uri;
              const track = res.body.tracks.items[0].name;
              console.log(track + ": " + uri);
              return {
                track: track,
                uri: uri,
                confidence: "high"
              };
            });
        } else {
          const parsedVideoTitle = item.video_title // Attempting to parse video title for better search success
            .replace(/karaoke/gi, "")
            .replace(/\[.*\]/, "")
            .replace(/\(.*\)/, "");
          // If artist and song name is undefined, search by title
          try {
            console.log(parsedVideoTitle);

            spotifyApi.searchTracks(parsedVideoTitle).then((res) => {
              const uri = res.body.tracks.items[0].uri;
              const track = res.body.tracks.items[0].name;
              console.log(track + ": " + uri);
              return {
                track: track,
                uri: uri,
                confidence: "low"
              };
            });
          } catch {
            console.log("No Result For: " + parsedVideoTitle);
          }
        }
      })
    );
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken); // Set accessToken to spotifyApi for song search
  }, [transferPlaylistToSpotify]); // Only get accessToken when clicked on TransferPlaylist Button

  // Fetch Videos Within Playlist
  useEffect(() => {
    (async () => {
      try {
        if (!selectedPlayList) return;

        const response = await Axios.get("/getYtAlbumSongs", {
          params: {
            playlistId: selectedPlayList.playlistId
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
  }, [selectedPlayList]); // Fetch everytime user clicks on new playlist

  // Fetch Playlist
  useEffect(() => {
    (async () => {
      try {
        setSelectPlayList(null);
        setExtractedSpotifyUri([]);
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
            chooseAlbum={chooseAlbum} // chooseAlbum also clears out allPlayLists so we can render selectedPlaylist
          />
        ))}
        {selectedPlayList && (
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
            {extractedSpotifyUri && (
              <div>
                {extractedSpotifyUri.map((item) => (
                  <TransferModal song={item.track} key={item.uri} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {selectedPlayList && (
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
