import React, { useState, useContext } from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import "./NavigationBar.css";
import { UserContext } from "./UserContext";
// import Axios from "./Axios";

function NavigationBar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  console.log(isLoggedIn);
  // const [user, setUser] = useState(null);
  // const isLoggedIn = Cookies.get("username") ? Cookies.get("username") : null;
  // const user = useRef(null);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const response = await Axios.get("/@me");
  //       setUser(response.data);
  //       // user.current = response.data.username;
  //     } catch (error) {
  //       if (error.response?.status === 401) {
  //         console.log("Not Authenticated");
  //         setUser(null);
  //         // user.current = null;
  //       }
  //     }
  //   })();
  //   return user;
  // }, []);

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
            {isLoggedIn.current ? (
              <>
                <Nav.Item>
                  <Nav.Link className='nav_a' href='/logout'>
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
