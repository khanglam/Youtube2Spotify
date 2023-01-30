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
  const [selectedPlayList, setSelectedPlayList] = useState(null); // Playlist that user clicked on
  const [choosenPlaylistItems, setChoosenPlaylistItems] = useState([]); // Songs in a given playlist ID
  const [youtubeItems, setYoutubeItems] = useState([]); // all_song_info within a specific Album (from /getYtAlbumSongs ID)

  // Spotify API Variables
  const [accessToken, setAccessToken] = useState(null);
  const [spotifyItems, setSpotifyItems] = useState([]); // Extracted Spotify Song List URI after Yt -> Spotify conversion
  const [spotifyURIs, setSpotifyURIs] = useState([]);
  const [isRequestDone, setIsRequestDone] = useState(false);

  function chooseAlbum(album) {
    setSelectedPlayList(album);
    setAllPlaylists([]);
  }

  async function transferPlaylistToSpotify() {
    setSpotifyItems([]);
    setSpotifyURIs([]);
    setIsRequestDone(false);
    youtubeItems.map(async (item) => {
      if (item.track !== null && item.artist !== null) {
        const searchRes = await spotifyApi.searchTracks(
          item.track + " " + item.artist
        );
        const smallestAlbumImage =
          searchRes.body.tracks.items[0].album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest; // whatever is returned will be the new accumulator for next iteration (reduce)
            },
            searchRes.body.tracks.items[0].album.images[0] // starting point (reduce)
          );
        setSpotifyItems((prevState) => [
          ...prevState,
          {
            confidence: "high",
            title: searchRes.body.tracks.items[0].name,
            artist: searchRes.body.tracks.items[0].artists[0].name,
            uri: searchRes.body.tracks.items[0].uri,
            thumbnail: smallestAlbumImage.url,
            key: item.video_title,
          },
        ]);
        setSpotifyURIs((prevState) => [
          ...prevState,
          searchRes.body.tracks.items[0].uri,
        ]);
        setIsRequestDone(true);
      } else {
        const parsedVideoTitle = item.video_title // Attempting to parse video title for better search success
          .replace(/karaoke/gi, "")
          .replace(/\[.*\]/, "")
          .replace(/\(.*\)/, "");
        // If artist and song name is undefined, search by title
        try {
          const searchRes = await spotifyApi.searchTracks(parsedVideoTitle);
          const smallestAlbumImage =
            searchRes.body.tracks.items[0].album.images.reduce(
              (smallest, image) => {
                if (image.height < smallest.height) return image;
                return smallest; // whatever is returned will be the new accumulator for next iteration (reduce)
              },
              searchRes.body.tracks.items[0].album.images[0] // starting point (reduce)
            );
          setSpotifyItems((prevState) => [
            ...prevState,
            {
              confidence: "low",
              title: searchRes.body.tracks.items[0].name,
              artist: searchRes.body.tracks.items[0].artists[0].name,
              uri: searchRes.body.tracks.items[0].uri,
              thumbnail: smallestAlbumImage.url,
              key: item.video_title,
            },
          ]);
          setSpotifyURIs((prevState) => [
            ...prevState,
            searchRes.body.tracks.items[0].uri,
          ]);
          setIsRequestDone(true);
        } catch {
          console.log("No Result For: " + parsedVideoTitle);
        }
      }
    });
  }
  // Print out spotifyItems with useEffect as useState's CallBack.
  useEffect(() => {
    if (isRequestDone) {
      const call = async () => {
        try {
          console.log(spotifyURIs);
          // const response = await Axios.post("/addSongsToPlaylist", {
          //   song_uris: spotifyURIs,
          //   playlist_name: "Imported Youtube Playlist",
          // });
          // console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      call();
    }
  }, [spotifyURIs]);

  async function addSongsToPlaylist() {
    try {
      const response = await Axios.post("/addSongsToPlaylist", {
        song_uris: spotifyURIs,
        playlist_name: "Imported Youtube Playlist",
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken); // Set accessToken to spotifyApi for song search
  }, [accessToken]); // Only get accessToken when clicked on TransferPlaylist Button

  // Fetch Videos Within Playlist
  useEffect(() => {
    (async () => {
      try {
        if (!selectedPlayList) return;
        const response = await Axios.get("/getYtAlbumSongs", {
          params: {
            playlistId: selectedPlayList.playlistId,
          },
        });
        // console.log(response.data);
        setChoosenPlaylistItems(
          response.data.response.items.map((video) => {
            const videoThumbnail = video.snippet.thumbnails.high;
            return {
              // return for map
              title: video.snippet.title,
              thumbnail: videoThumbnail.url,
              videoId: video.id,
            };
          })
        );
        setYoutubeItems(
          response.data.all_song_info.map((song) => {
            return {
              // return for map
              artist: song.artist,
              track: song.song_name,
              spotify_uri: song.spotify_uri,
              video_title: song.video_title,
              youtube_url: song.youtube_url,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, [selectedPlayList]); // Fetch everytime user clicks on new playlist

  // Fetch Playlist / On Pageload
  useEffect(() => {
    (async () => {
      try {
        setSelectedPlayList(null);
        setSpotifyItems([]);
        // Get Spotify Access Token
        let response = await Axios.get("/loginSpotify");
        setAccessToken(response.data["access_token"]);

        response = await Axios.get("/getYtPlaylist");
        setAllPlaylists(
          response.data.items.map((album) => {
            const albumThumbnail = album.snippet.thumbnails.high;
            return {
              // return for map
              title: album.snippet.title,
              thumbnail: albumThumbnail.url,
              playlistId: album.id,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []); // Only need to load this once

  return (
    <Container className="d-flex flex-column" style={{ height: "90vh" }}>
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {allPlayLists.map((album) => (
          <PlayListResult
            album={album}
            key={album.id}
            chooseAlbum={chooseAlbum} // chooseAlbum also clears out allPlayLists so we can render selectedPlaylist
          />
        ))}
        {selectedPlayList && (
          <div
            className="text-center"
            style={{
              whiteSpace: "pre",
              fontFamily: "Comic Sans",
              fontSize: "25px",
            }}
          >
            {choosenPlaylistItems.map(
              (
                video // Load Videos From Playlist
              ) => (
                <VideoResults video={video} key={video.id} />
              )
            )}
            {/* Automatically convert all songs into spotify playlist */}
            {/* {transferPlaylistToSpotify()} */}
            {/* {spotifyItems.length !== 0 && (
              <div>
                {spotifyItems.map((item) =>
                  <TransferModal song={item} key={item.key} />
                )}
              </div>
            )} */}
          </div>
        )}
      </div>
      {selectedPlayList && (
        <input
          type="button"
          className="btn btn-success"
          value="Transfer This Playlist to Spotify"
          style={{
            maxHeight: "38px",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
          onClick={() => {
            transferPlaylistToSpotify();
            // addSongsToPlaylist();
          }}
        ></input>
      )}
    </Container>
  );
}

export default TransferPlaylist;
