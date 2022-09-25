import React from "react";

export default function PlayListResult({ album, chooseAlbum }) {
  function handlePlay() {
    chooseAlbum(album);
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={album.thumbnail} style={{ height: "128px", width: "128px" }} />
      <div
        className="text-center ml-3"
        style={{
          whiteSpace: "pre",
          fontFamily: "Comic Sans",
          fontSize: "25px",
        }}
      >
        <div>{album.title}</div>
      </div>
    </div>
  );
}
