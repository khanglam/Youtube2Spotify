import React, {useState} from 'react'
import {Nav, Navbar, Container} from 'react-bootstrap'
import styled from 'styled-components'
import './NavigationBar.css'

// const Styles = styled.div`
//   .navbar {
//     background-color: #222;
//   }
//   a, .navbar-brand, .navbar-nav .nav-link {
//     color: #bbb;
//     &:hover {
//       color: white;
//     }
//   }
// `;

function NavigationBar() {
  return (
    
    <Navbar expand = "md navbar-dark bg-steel fixed-top"> 
      <Container>
        <Navbar.Brand className='navbar-brand mr-4' href="/">Youtube2Spotify</Navbar.Brand>
        <Navbar.Toggle aria-controls='id_to_toggle'/>
        <Navbar.Collapse id="id_to_toggle">
          <Nav className="navbar-nav mr-auto">
            <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link href="/about">About</Nav.Link></Nav.Item>
          </Nav>
          <Nav className="navbar-nav">
            <Nav.Item><Nav.Link href="/login">Login</Nav.Link></Nav.Item>
            <Nav.Item><Nav.Link href="/register">Register</Nav.Link></Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    
    
  //   <header class="site-header">
  //     <nav class="navbar navbar-expand-md navbar-dark bg-steel fixed-top">
  //     <div class="container">
  //       <a class="navbar-brand mr-4" href="/">Youtube2Spotify</a>
  //       <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle" aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
  //         <span class="navbar-toggler-icon"></span>
  //       </button>
  //       <div class="collapse navbar-collapse" id="navbarToggle">
  //         <div class="navbar-nav mr-auto">
  //           <a class="nav-item nav-link" href="{{ url_for('home') }}">Home</a>
  //           <a class="nav-item nav-link" href="{{ url_for('about') }}">About</a>
  //         </div>
          
  //         <div class="navbar-nav">
            
  //           {/* <a class="nav-item nav-link" href="{{ url_for('account') }}">Account</a>
  //             <a class="nav-item nav-link" href="{{ url_for('logout') }}">Logout</a> */}
          
  //             <a class="nav-item nav-link" href="/login">Login</a>
  //             <a class="nav-item nav-link" href="{{ url_for('register') }}">Register</a>
            
  //         </div>
  //       </div>
  //     </div>
  //   </nav>
  // //</header>
  )
}

export default NavigationBar