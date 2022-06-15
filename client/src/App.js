import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Login from "./components/pages/Login";
import { logOut } from "./components/pages/Logout";
import NoMatch from "./components/pages/NoMatch";
import { Register } from "./components/pages/Register";

import WelcomePage from "./components/WelcomePage";
import Layout from "./components/Layout";

import { UserContext } from "./components/UserContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Unused
  const isLoggedInMemo = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn }),
    [isLoggedIn, setIsLoggedIn]
  );

  return (
    <>
      <UserContext.Provider value={isLoggedInMemo}>
        <Router>
          <Switch>
            <Route exact path='/' component={WelcomePage} />

            <Layout>
              <Switch>
                <Route path='/home' component={Home} />
                <Route path='/about' component={About} />
                <Route path='/login' component={Login} />
                <Route path='/logout' component={logOut} />
                <Route path='/register' component={Register} />
                <Route component={NoMatch} />
              </Switch>
            </Layout>
          </Switch>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
