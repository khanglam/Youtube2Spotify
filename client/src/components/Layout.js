import React from 'react'
import {Container} from 'react-bootstrap'
import NavigationBar from './NavigationBar'

function Layout(props) {
  return (
    <>
      <header class="site-header">
        <NavigationBar />
      </header>

      <Container>
          {props.children}
      </Container>
    </>
  )
}

export default Layout