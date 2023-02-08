import React from "react";

export default function VideoResults({ video, chooseAlbum }) {
  function handlePlay() {
    // chooseAlbum(album);
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={video.thumbnail} style={{ height: "128px", width: "128px" }} />
      <div
        className="text-center ml-3"
        style={{
          whiteSpace: "pre",
          fontFamily: "Comic Sans",
          fontSize: "25px",
        }}
      >
        <div>{video.title}</div>
      </div>
    </div>
  );
}
