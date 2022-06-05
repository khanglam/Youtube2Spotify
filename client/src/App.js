import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button, Alert, Breadcrumb } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Axios from "./components/Axios";

import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Login from "./components/pages/Login";
import Logout from "./components/pages/Logout";
import NoMatch from "./components/pages/NoMatch";
import { Register } from "./components/pages/Register";

import Layout from "./components/Layout";
import NavigationBar from "./components/NavigationBar";
import { UserContext } from "./components/UserContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isLoggedInMemo = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn }),
    [isLoggedIn, setIsLoggedIn]
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get("/@me");
        setIsLoggedIn(true);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("Not Authenticated");
          setIsLoggedIn(false);
        }
      }
    })();
    return isLoggedIn;
  }, []);

  return (
    <React.Fragment>
      <UserContext.Provider value={isLoggedInMemo}>
        <NavigationBar />
        <Layout>
          <Router>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/about' component={About} />
              <Route path='/login' component={Login} />
              <Route path='/logout' component={Logout} />
              <Route path='/register' component={Register} />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </Layout>
      </UserContext.Provider>
    </React.Fragment>
  );
}

export default App;
