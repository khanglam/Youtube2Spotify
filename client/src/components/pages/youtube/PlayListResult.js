import React from "react";

export default function PlayListResult({ album }) {
  function handlePlay() {
    // chooseTrack(album);
  }

  return (
    <div
      className='d-flex m-2 align-items-center'
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={album.albumUrl} style={{ height: "128px", width: "128px" }} />
      <div className='ml-3'>
        <div>{album.title}</div>
      </div>
    </div>
  );
}
