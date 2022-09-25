import { React, useState, useEffect, useContext } from "react";
import { Container, Form } from "react-bootstrap";
import Axios from "../../Axios";
import PlayListResult from "./PlayListResult";
import VideoResults from "./VideoResults";

function TransferPlaylist() {
  const [playLists, setPlayLists] = useState([]); // All Playlists in a given yt channel
  const [selectPlayList, setSelectPlayList] = useState(null); // Playlist that user clicked on
  const [playlistItems, setPlaylistItems] = useState([]); // Songs in a given playlist ID

  function chooseAlbum(album) {
    setSelectPlayList(album);
    setPlayLists([]);
  }

  // Fetch Videos Within Playlist
  useEffect(() => {
    (async () => {
      try {
        if (!selectPlayList) return;

        const response = await Axios.get("/getYtAlbumSongs", {
          params: {
            playlistId: selectPlayList.playlistId,
          },
        });
        console.log(response.data);
        setPlaylistItems(
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
        setPlayLists(
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
        {playLists.map((album) => (
          <PlayListResult
            album={album}
            key={album.id}
            chooseAlbum={chooseAlbum}
          />
        ))}
        {selectPlayList && (
          <div
            className="text-center"
            style={{
              whiteSpace: "pre",
              fontFamily: "Comic Sans",
              fontSize: "25px",
            }}
          >
            {playlistItems.map((video) => (
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
            // setStreamMusic(false);
          }}
        ></input>
      )}
    </Container>
  );
}

export default TransferPlaylist;
