import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, useLocation } from 'react-router-dom';
import { useHistory } from "react-router-dom"

import Qs from 'qs';
import axios from 'axios';

import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import NotificationsComponent from './pages/Notifications';

import TransactionControl from './pages/TransactionControl';
import TransactionCallback from './pages/TransactionCallback';
import Send from './pages/Send';
import Request from './pages/Request';
import LinkUser from './pages/LinkUser';
import LinkRequest from './pages/LinkRequest';

import Accounts from './pages/Accounts';
import Account from './pages/Account';
import AddAccount from './pages/AddAccount';
import AuthAccount from './pages/AuthAccount';


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
  const [BankAccountsState, SetBankAccounts] = useState([]) 
  const [TransactionsState, SetTransactions] = useState([]) 
  const [NotificationsState, SetNotifications] = useState([]) 

  const handleLogin = user => {
    user.date = Date.now()
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    refreshTokens()
    history.replace("/")
  }
  const handleLogout = () => {
    axios.get(process.env.REACT_APP_API_URL+"logout", {headers: { Authorization: `Bearer ${getUser()?.token}` }}
    ).then(({ data }) => {
      localStorage.clear()
      setUser(undefined)
      history.replace("/")
    })
  }


  const handleReload = () => {
    if (getUser()?.token) {
      
      axios.get( process.env.REACT_APP_API_URL+"auth/",  {headers: { Authorization: `Bearer ${getUser()?.token}` }}
      ).then( (response) => {
        let userData = { token: getUser()?.token, user: response.data, date: Date.now() }
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData.user) 
      }).catch((error) => {
        console.error(error.response.data)
        localStorage.clear()
        history.replace("/login")
      });

      axios.get( process.env.REACT_APP_API_URL+"fetch-banks/",  {headers: { Authorization: `Bearer ${getUser()?.token}` }}
      ).then( (response) => {
        SetBankAccounts(response.data)
      }).catch((error) => {
        console.warn(error.response)
      });

      axios.get( process.env.REACT_APP_API_URL+"fetch-transactions/",  {headers: { Authorization: `Bearer ${getUser()?.token}` }}
      ).then( (response) => {
        SetTransactions(response.data)
      }).catch((error) => {
        console.warn(error.response)
      });

      axios.get( process.env.REACT_APP_API_URL+"fetch-notifications/",  {headers: { Authorization: `Bearer ${getUser()?.token}` }}
      ).then( (response) => {
        SetNotifications(response.data)
      }).catch((error) => {
        console.warn(error.response)
      });

    }
  }

  const refreshTokens = () => {
    if (getUser()?.token) {
      axios.get(process.env.REACT_APP_API_URL+"refresh-tokens", {headers: { Authorization: `Bearer ${getUser()?.token}` }}
      ).then(({ data }) => {
        console.log("Refreshed tokens")
      })
    }
  }

  let location = useLocation();
  let history = useHistory();

  useEffect(() => {
    if (location.pathname === "/") {
      handleReload()
    } 

    if (location.pathname === "/send-payment" || location.pathname === "/request-payment" 
      || location.pathname === "/user/:userSlug" || location.pathname === "/request/:transactionID") {
      refreshTokens()
    }

    
    const interval_data = setInterval(() => {
        handleReload()
    }, 60000*1);
    const interval_tokens = setInterval(() => {
        refreshTokens()
    }, 60000*5); // Every 5 minutes
    return () => {clearInterval(interval_data);clearInterval(interval_tokens);  };
  }, [location.pathname]);


  //console.log(!getUser() ? "No session" : "Session active", getUser().user, "-" , !user ? "No session" : "Session active" , user)


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
    <TransitionGroup user={ user }>
      <CSSTransition key={location.key}  classNames="fade" timeout={300} >
        <Switch location={location}>
  
          <Route path="/notifications">
            <NotificationsComponent Notifications={ NotificationsState }/>
          </Route>
          <Route path="/settings" >
            <Settings logout={handleLogout} user={ user }/>
          </Route>







          <Route path="/send-payment">
             {/*<Send />*/}
            <TransactionControl transactionType="Send"/>
          </Route>
          <Route path="/request-payment">
             {/*<Request />*/}
            <TransactionControl transactionType="Request"/>
          </Route>
          <Route path="/user/:userSlug">
             {/*<LinkUser />*/}
            <TransactionControl transactionType="User"/>
          </Route>
          <Route path="/request/:transactionID">
             {/*<LinkRequest />*/}
            <TransactionControl transactionType="Payment"/>
          </Route>
          <Route path="/complete-payment/:bank">
             {/*<LinkRequest />*/}
            <TransactionCallback />
          </Route>








          
          <Route path="/accounts">
            <Accounts user={ user } BankAccounts={BankAccountsState}/>
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
            <Dashboard user={ user } BankAccounts={BankAccountsState} Transactions={TransactionsState} Notifications={NotificationsState}/>
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  )

}