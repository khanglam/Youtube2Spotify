import { React, useState, useEffect, useContext } from "react";
import { Container, Form } from "react-bootstrap";
import Axios from "../../Axios";
import PlayListResult from "./PlayListResult";

function TransferPlaylist() {
  const [playList, setPlayList] = useState([]);
  // Fetch Playlist
  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get("/getYtPlaylist");
        setPlayList(
          response.data.items.map((album) => {
            const albumThumbnail = album.snippet.thumbnails.high;
            return {
              // return for map
              title: album.snippet.title,
              albumUrl: albumThumbnail.url
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <Container className='d-flex flex-column' style={{ height: "90vh" }}>
      <div className='flex-grow-1 my-2' style={{ overflowY: "auto" }}>
        {playList.map((album) => (
          <PlayListResult album={album} key={album.id} />
        ))}
        <div
          className='text-center'
          style={{
            whiteSpace: "pre",
            fontFamily: "Comic Sans",
            fontSize: "25px"
          }}
        ></div>
      </div>
      <div>Bottom</div>
    </Container>
  );
}

export default TransferPlaylist;
