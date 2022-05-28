import React, {useState, Component} from 'react';
import {Button, Alert, Breadcrumb} from 'react-bootstrap';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from './components/pages/Home';
import About from './components/pages/About';
import Login from './components/pages/Login';
import NoMatch from './components/pages/NoMatch';

import Layout from './components/Layout';
import NavigationBar from './components/NavigationBar';
import { Register } from './components/pages/Register';

function App() {

    const [user, setUser] = useState({name: "", email: ""});
    const [error, setError] = useState("");

    const login = details => {
      console.log(details);
    }

    const logout = () => {
      console.log("Logout");
    }

    return (
      <React.Fragment>
        {/* <NavigationBar /> */}
        <Layout>
          <Router>
            <Switch>
              <Route exact path = "/" component= {Home} />
              <Route path = "/about" component={About} />
              <Route path = "/login" component={Login} />
              <Route path = "/register" component={Register} />
              <Route component = {NoMatch} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    );
}

export default App