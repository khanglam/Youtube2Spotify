import React from "react";
import NavigationBar from "./NavigationBar";
import "../App.css";

function Layout(props) {
  return (
    <>
      <header className='site-header'>
        <NavigationBar />
      </header>
      <main role='main'>
        <div className='container'>{props.children}</div>
      </main>
    </>
  );
}
export default Layout;
