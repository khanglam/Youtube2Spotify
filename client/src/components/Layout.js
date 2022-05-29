import React from "react";
import { Container } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import "../App.css";

function Layout(props) {
  return (
    <>
      <header class='site-header'>
        <NavigationBar />
      </header>
      <main role='main'>
        <div class='container'>{props.children}</div>
      </main>
    </>
  );
}
export default Layout;
