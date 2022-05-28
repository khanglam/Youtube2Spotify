import React, { useState } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import styled from "styled-components";
import "./NavigationBar.css";

// const Styles = styled.div`
//   .navbar {
//     background-color: #222;
//   }
//   a,
//   .navbar-brand,
//   .navbar-nav .nav-link {
//     color: #bbb;
//     &:hover {
//       color: white;
//     }
//   }
//
// `;

function NavigationBar() {
  return (
    <Navbar expand='md navbar-dark bg-steel'>
      <Container>
        <Navbar.Brand className='navbar-brand mr-4' href='/'>
          Youtube2Spotify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='id_to_toggle' />
        <Navbar.Collapse id='id_to_toggle'>
          <Nav className='navbar-nav mr-auto'>
            <Nav.Item>
              <Nav.Link className='nav_a' href='/'>
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='nav_a' href='/about'>
                About
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav className='navbar-nav'>
            <Nav.Item>
              <Nav.Link className='nav_a' href='/login'>
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className='nav_a' href='/register'>
                Register
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
