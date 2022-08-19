import React, { useState, useContext, useEffect } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import "./NavigationBar.css";
import { UserContext } from "./UserContext";
import { NavLink } from "react-router-dom";

function NavigationBar() {
  const { isLoggedIn } = useContext(UserContext); // Unused

  return (
    <>
      <Navbar expand='md navbar-dark bg-steel'>
        <Container>
          <NavLink to='/' className='navbar-brand mr-4'>
            Youtube2Spotify
          </NavLink>
          <Navbar.Toggle aria-controls='id_to_toggle' />
          <Navbar.Collapse id='id_to_toggle'>
            <Nav className='navbar-nav mr-auto'>
              <Nav.Item>
                <NavLink to='/home' className='nav-link'>
                  Home
                </NavLink>
              </Nav.Item>
              <Nav.Item>
                <NavLink to='/about' className='nav-link'>
                  About
                </NavLink>
              </Nav.Item>
            </Nav>
            <Nav className='navbar-nav'>
              {isLoggedIn ? (
                <>
                  <Nav.Item>
                    <NavLink to='/About' className='nav-link'>
                      Account
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink to='/Spotify' className='nav-link'>
                      Spotify
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink to='/Youtube' className='nav-link'>
                      YouTube
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink to='/logout' className='nav-link'>
                      Logout
                    </NavLink>
                  </Nav.Item>
                </>
              ) : (
                <>
                  <Nav.Item>
                    <NavLink to='/login' className='nav-link'>
                      Login
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink to='/register' className='nav-link'>
                      Register
                    </NavLink>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
