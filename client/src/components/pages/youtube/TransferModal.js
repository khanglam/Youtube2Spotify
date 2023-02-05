import { React, useState } from "react";
import ReactDom from "react-dom";

const CONTAINER_STYLE = {
  position: "fixed",
  display: "flex",
  flexDirection: "column",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "30px",
  zIndex: 1000,
  height: "85vh",
  width: "50vw",
};

const OVERLAY_STYLE = {
  position: "fixed",
  display: "flex",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  padding: "50px",
  zIndex: 1000,
};

const ITEM_STYLE = {
  display: "flex",
  alignItems: "center",
  marginBottom: "5px",
  cursor: "pointer",
  border: "1px solid black",
};

export default function TransferModal({
  playlists,
  transfer,
  transferButton,
  successButton,
  closeOverlay,
}) {
  const [selectedPlaylistName, setSelectedPlaylistName] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("+ New Playlist +");

  function selectPlaylist(playlistName) {
    setNewPlaylistName("+ New Playlist +");
    setSelectedPlaylistName(playlistName);
  }

  // Pass back the selected playlist callback to parent class (TransferPlaylist)
  function handleTransfer() {
    transfer(selectedPlaylistName);
  }

  function handleNewPlaylistName(e) {
    const newPlaylist = e.target.value;
    setNewPlaylistName(newPlaylist);
    setSelectedPlaylistName(newPlaylist);
  }

  // Close overlay if clicked outside
  function closePopup() {
    closeOverlay([]);
  }

  if (!playlists) {
    return null;
  }
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLE} onClick={() => closePopup()} />
      <div style={CONTAINER_STYLE}>
        <div style={{ overflowY: "auto" }}>
          <div
            className="text-center"
            style={{
              whiteSpace: "pre",
              fontFamily: "Comic Sans",
              fontSize: "25px",
            }}
          >
            <input
              style={{
                ...ITEM_STYLE,
                height: "64px",
                width: "100%",
                textAlign: "center",
                alignItems: "center",
              }}
              value={newPlaylistName}
              onClick={() => setNewPlaylistName("")}
              onChange={handleNewPlaylistName}
            />
          </div>
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              style={{
                ...ITEM_STYLE,
                backgroundColor:
                  playlist.name === selectedPlaylistName
                    ? "rgb(144, 238, 144)"
                    : null,
              }}
              onClick={() => selectPlaylist(playlist.name)}
            >
              <img
                src={playlist.thumbnail}
                style={{ height: "64px", width: "64px" }}
              />
              <div
                className="text-center ml-3"
                style={{
                  whiteSpace: "pre",
                  fontFamily: "Comic Sans",
                  fontSize: "25px",
                }}
              >
                <div>{playlist.name}</div>
              </div>
            </div>
          ))}
        </div>
        <input
          type="button"
          className={successButton}
          value={transferButton}
          style={{
            maxHeight: "38px",
            marginTop: "10px",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
          onClick={() => {
            handleTransfer();
          }}
        ></input>
      </div>
    </>,
    document.getElementById("portal")
  );
}
