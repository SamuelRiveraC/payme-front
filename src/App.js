import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { useHistory } from "react-router-dom"

import axios from 'axios';

import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

import Send from './pages/Send';
import Request from './pages/Request';

import Accounts from './pages/Accounts';
import Account from './pages/Account';
import AddAccount from './pages/AddAccount';
import AuthAccount from './pages/AuthAccount';


import LinkUser from './pages/LinkUser';
import LinkRequest from './pages/LinkRequest';

import { TransitionGroup, CSSTransition } from 'react-transition-group';    

export default function AppContainer() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="*" >
          <App />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
//
function App() {
  const getUser = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user
  }
  const [user, setUser] = useState(getUser()) 

  const handleLogin = user => {
    user.date = Date.now()
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    history.push("/")
  }
  const handleLogout = () => {
    axios.get(process.env.REACT_APP_API_URL+"logout", {headers: { Authorization: `Bearer ${getUser()?.token}` }}
    ).then(({ data }) => {
      localStorage.clear()
      setUser(undefined)
      history.replace("/")
      // history.clear()
    })
  }


  const handleReload = () => {
    if (getUser()?.token) {
      axios.get( process.env.REACT_APP_API_URL+"auth/",  {headers: { Authorization: `Bearer ${getUser()?.token}` }}
      ).then( (response) => {
        //Should Recover token and reload it      console.log(response.data)
        let userData = {
          type: "bearer",
          token: getUser()?.token,
          user: response.data,
          date: Date.now()
        }
        console.log("handleReload")
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData) 

      })
      .catch((error) => {
        // alert(error.response.data.code)
        localStorage.clear()
        history.push("/login")
      });
    }
  }


  let location = useLocation();
  let history = useHistory();

  useEffect(() => {
    if (location.pathname === "/") {
      handleReload()
    }
    // SET TO TRUE TO ACTIVATE THE TIMER / REPLACE WITH A SERVICE PROVIDER <3
    if (false) {
      const interval = setInterval(() => {
        if (location.pathname === "/") {
          console.log("Debug - Handling reload")
          handleReload()
        }
      }, 60000); // Every minute 
      return () => clearInterval(interval);
    }
  }, [location.pathname]);


  //console.log(!getUser() ? "No session" : "Session active", getUser(), "-" , !user ? "No session" : "Session active" , user)


  if (!user) {
    return (
      <TransitionGroup>
        <CSSTransition key={location.key}  classNames="fade" timeout={300} >
          <Switch location={location}>
            <Route path="/login">
              <Login setToken={handleLogin} />
            </Route>
            <Route path="/register">
              <Register setToken={handleLogin} />
            </Route>
            <Route path="/">
              <Onboarding />
            </Route>
          </Switch>
        </CSSTransition> 
      </TransitionGroup>
      )
  }

  return (
    <TransitionGroup user={ user.user }>
      <CSSTransition key={location.key}  classNames="fade" timeout={300} >
        <Switch location={location}>
  
          <Route path="/notifications">
            <Notifications user={ user.user }/>
          </Route>
          <Route path="/settings" >
            <Settings logout={handleLogout} user={ user.user }/>
          </Route>
          <Route path="/send-payment">
            <Send />
          </Route>
          <Route path="/request-payment">
            <Request />
          </Route>
  
          <Route path="/user/:id">
            <LinkUser />
          </Route>
  
          <Route path="/request/:id">
            <LinkRequest />
          </Route>
          
          <Route path="/accounts">
            <Accounts user={ user.user }/>
          </Route>
          <Route path="/account/:id">
            <Account />
          </Route>


          <Route path="/add-account/:bank">
            <AuthAccount />
          </Route>
          
          <Route path="/add-account">
            <AddAccount />
          </Route>

          <Route path="/" >
            <Dashboard user={ user.user }/>
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  )

}