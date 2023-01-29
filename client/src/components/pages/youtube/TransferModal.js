import React from "react";
import ReactDom from "react-dom";

const STYLE = {
  position: "fixed",
  display: "flex",
  // height: "10%",
  // width: "10%",
  border: "1px solid red",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "50px",
  zIndex: 1000
};
// position: "fixed",
// top: "50%",
// left: "50%",
// transform: "translate(-50%, -50%)",
// backgroundColor: "#FFF",
// padding: "50px",
// zIndex: 1000
const OVERLAY_STYLE = {
  position: "fixed",
  display: "flex",
  border: "1px solid blue",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  padding: "50px",
  zIndex: 1000
};

export default function TransferModal({ song }) {
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLE} />
      <div style={STYLE}>
        <img src={song.thumbnail} style={{ height: "128px", width: "128px" }} />
        <div
          className='text-center ml-3'
          style={{
            whiteSpace: "pre",
            fontFamily: "Comic Sans",
            fontSize: "25px"
          }}
        >
          <div>{song.title}</div>
        </div>
      </div>
      {/* <div className='d-flex m-2 align-items-center' style={STYLE}>
        <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
        <div className='ml-3'>
          <div>{track.title}</div>
          <div className='text-muted'>{track.artist}</div>
        </div>
      </div> */}
    </>,
    document.getElementById("portal")
  );
}
