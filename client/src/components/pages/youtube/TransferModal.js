import React from "react";
import ReactDom from "react-dom";

const STYLE = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "50px",
  zIndex: 1000
};
const OVERLAY_STYLE = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  padding: "50px",
  zIndex: 1000
};

export default function TransferModal({ track }) {
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLE} />
      <div style={STYLE}>HELLO WORLD</div>
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
