import React, { useState, useEffect } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import "./NavigationBar.css";
import Axios from "./Axios";

function NavigationBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get("/@me");
        setUser(response.data);
      } catch (error) {
        console.log("Not Authenticated");
      }
    })();
  }, []);

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
            {user != null ? (
              <>
                <Nav.Item>
                  <Nav.Link className='nav_a' href='/login'>
                    Logout
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className='nav_a' href='/About'>
                    Account
                  </Nav.Link>
                </Nav.Item>
              </>
            ) : (
              <>
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
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
