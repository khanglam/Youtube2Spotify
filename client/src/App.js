import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, Alert, Breadcrumb } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Axios from "./components/Axios";

import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Login from "./components/pages/Login";
import { logOut } from "./components/pages/Logout";
import NoMatch from "./components/pages/NoMatch";
import { Register } from "./components/pages/Register";

import Layout from "./components/Layout";
import { UserContext } from "./components/UserContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isLoggedInMemo = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn }),
    [isLoggedIn, setIsLoggedIn]
  );

  return (
    <>
      <UserContext.Provider value={isLoggedInMemo}>
        <Router>
          <Layout>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/about' component={About} />
              <Route path='/login' component={Login} />
              <Route path='/logout' component={logOut} />
              <Route path='/register' component={Register} />
              <Route component={NoMatch} />
            </Switch>
          </Layout>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
