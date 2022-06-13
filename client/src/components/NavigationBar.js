import React, { useState, useContext, useEffect } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import "./NavigationBar.css";
import { UserContext } from "./UserContext";
import { NavLink } from "react-router-dom";
import Axios from "./Axios";

function NavigationBar() {
  const { isLoggedIn } = useContext(UserContext); // Unused
  const [user, setUser] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get("/@me");
        setUser(true);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("Not Authenticated");
          setUser(false);
        }
      }
    })();
    return function cleanup() {
      // do something when unmount component
    };
  }, []);

  return (
    <>
      <Navbar expand='md navbar-dark bg-steel'>
        <Container>
          <Navbar.Brand className='navbar-brand mr-4' href='/'>
            Youtube2Spotify
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='id_to_toggle' />
          <Navbar.Collapse id='id_to_toggle'>
            <Nav className='navbar-nav mr-auto'>
              <Nav.Item>
                <NavLink to='/' className='nav-link'>
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
              {user ? (
                <>
                  <Nav.Item>
                    <NavLink to='/logout' className='nav-link'>
                      Logout
                    </NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink to='/About' className='nav-link'>
                      Account
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
