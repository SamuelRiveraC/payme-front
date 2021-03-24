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
  let storageAccounts = JSON.parse(localStorage.getItem('BankAccounts'))  
  let storageTransactions = JSON.parse(localStorage.getItem('Transactions'))  
  let storageNotifications = JSON.parse(localStorage.getItem('Notifications')) 
  
  const [UserState, setUserState] = useState(getUser()?.user) 
  const [BankAccountsState, SetBankAccounts] = useState(storageAccounts ? storageAccounts : []) 
  const [TransactionsState, SetTransactions] = useState(storageTransactions ? storageTransactions : []) 
  const [NotificationsState, SetNotifications] = useState(storageNotifications ? storageNotifications : []) 



  
  

  const handleLogin = user => {
    user.date = Date.now()
    localStorage.setItem('user', JSON.stringify(user));
    setUserState(user.user);
    refreshTokens()
    handleReload()
    history.replace("/")
  }
  const handleLogout = () => {
    axios.get(process.env.REACT_APP_API_URL+"logout", 
      {headers: { Authorization: `Bearer ${getUser()?.token}` }}
    ).then(({ data }) => {
      setUserState(undefined)
      localStorage.clear('user')
      localStorage.clear('BankAccounts')
      localStorage.clear('Transactions')
      localStorage.clear('Notifications')
      history.replace("/")
    })
  }


  const handleReload = () => {
    if (getUser()?.token) {
      
      axios.get( process.env.REACT_APP_API_URL+"auth/",  
        {headers: { Authorization: `Bearer ${getUser()?.token}` }}
      ).then( (response) => {
        let userData = { token: getUser()?.token, user: response.data, date: Date.now() }
        localStorage.setItem('user', JSON.stringify(userData));
        setUserState(userData.user) 
      }).catch((error) => {
        console.error(error.response.data) 
        if (error.response.status === 401) {
          setUserState(null)
          localStorage.clear('user')
          localStorage.clear('BankAccounts')
          localStorage.clear('Transactions')
          localStorage.clear('Notifications')
          history.replace("/login")
        }
      });

      axios.get( process.env.REACT_APP_API_URL+"fetch-banks/",
        {headers: { Authorization: `Bearer ${getUser()?.token}` }}
      ).then( (response) => {
        SetBankAccounts(response.data ?? [])
        localStorage.setItem('BankAccounts', JSON.stringify(response.data));
      }).catch((error) => {
        console.warn(error.response)
      });

      axios.get( process.env.REACT_APP_API_URL+"fetch-transactions/",
        {headers: { Authorization: `Bearer ${getUser()?.token}` }}
      ).then( (response) => {
        SetTransactions(response.data ?? [])
        localStorage.setItem('Transactions', JSON.stringify(response.data));
      }).catch((error) => {
        console.warn(error.response)
      });

      axios.get( process.env.REACT_APP_API_URL+"fetch-notifications/",
        {headers: { Authorization: `Bearer ${getUser()?.token}` }}
      ).then( (response) => {
        SetNotifications(response.data ?? [])
        localStorage.setItem('Notifications', JSON.stringify(response.data));
      }).catch((error) => {
        console.warn(error.response)
      });
    } else {
      handleLogout()
    }
  }

  const refreshTokens = () => {
    if (getUser()?.token) {
      axios.get(process.env.REACT_APP_API_URL+"refresh-tokens", 
        {headers: { Authorization: `Bearer ${getUser()?.token}` }}
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
    }, 60000*1); // Every 1 minute
    const interval_tokens = setInterval(() => {
        refreshTokens()
    }, 60000*5); // Every 5 minutes
    return () => {
      clearInterval(interval_data);
      clearInterval(interval_tokens);
    };
  }, [location.pathname]);

  //console.log(!getUser() ? "No session" : "Session active", getUser().user, "-" , !user ? "No session" : "Session active" , user)

  if (!UserState) {
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
    <TransitionGroup>
      <CSSTransition key={location.key}  classNames="fade" timeout={300} >
        <Switch location={location}>
  

          <Route path="/send-payment">
            <TransactionControl transactionType="Send"/>
          </Route>
          <Route path="/request-payment">
            <TransactionControl transactionType="Request"/>
          </Route>
          <Route path="/user/:userSlug">
            <TransactionControl transactionType="User"/>
          </Route>
          <Route path="/request/:transactionID">
            <TransactionControl transactionType="Payment"/>
          </Route>
          <Route path="/complete-payment/:bank">
            <TransactionCallback />
          </Route>








          <Route path="/notifications">
            <NotificationsComponent Notifications={ NotificationsState }/>
          </Route>
          <Route path="/settings" >
            <Settings logout={handleLogout} user={ UserState }/>
          </Route>
          
          <Route path="/accounts">
            <Accounts user={ UserState } BankAccounts={BankAccountsState}/>
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

          <Route path="/">
            <Dashboard user={ UserState } 
              BankAccounts={BankAccountsState} 
              Transactions={TransactionsState} 
              Notifications={NotificationsState}
              triggerRefresh={() => handleReload()}
            />
          </Route>
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  )

}