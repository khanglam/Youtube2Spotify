import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './components/pages/Home';
import Account from './components/pages/Account';
import Login from './components/pages/Login';
import { logOut } from './components/pages/Logout';
import NoMatch from './components/pages/NoMatch';
import { Register } from './components/pages/Register';
import Spotify from './components/pages/spotify/Spotify';
import Youtube from './components/pages/youtube/Youtube';

import WelcomePage from './components/WelcomePage';
import Layout from './components/Layout';
import Axios from './components/Axios';

import { UserContext } from './components/UserContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const isLoggedInMemo = useMemo(
    () => ({ isLoggedIn, setIsLoggedIn, username, setUsername }),
    [isLoggedIn, setIsLoggedIn, username, setUsername]
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await Axios.get('/@me');
        setIsLoggedIn(true);
        setUsername(response.data.username);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log('Not Authenticated');
          setIsLoggedIn(false);
        }
      }
    })();
    return function cleanup() {
      // do something when unmount component
    };
  }, []);

  return (
    <>
      <UserContext.Provider value={isLoggedInMemo}>
        <Router>
          <Switch>
            <Route
              path={['/home', '/account', 'spotify', '/youtube', '/logout']}
            >
              <Layout>
                <Switch>
                  <Route path='/home' component={Home} />
                  <Route path='/account' component={Account} />
                  <Route path='/spotify' component={Spotify} />
                  <Route path='/youtube' component={Youtube} />
                  <Route path='/logout' component={logOut} />
                </Switch>
              </Layout>
            </Route>
            <Route path={['/login', '/register', '/']}>
              {isLoggedIn ? (
                <Layout>
                  <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/account' component={Account} />
                    <Route path='/spotify' component={Spotify} />
                    <Route path='/logout' component={logOut} />
                    <Route component={NoMatch} />
                  </Switch>
                </Layout>
              ) : (
                <WelcomePage>
                  <Switch>
                    <Route exact path='/' component={Login} />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route component={Login} />
                  </Switch>
                </WelcomePage>
              )}
            </Route>
          </Switch>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
