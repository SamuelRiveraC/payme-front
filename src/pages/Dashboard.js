import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Transaction from '../components/Transaction';

export default function Dashboard({user}) {

  let balance, userAccounts = 0
  let Notifications, AllTransactions = []

  if (user.bankAccounts)
    userAccounts = user.bankAccounts.length
    balance = user.bankAccounts.find(item => item.primary === "true")?.balance;

  if (user.notifications)
    Notifications = user.notifications.filter(function(item) { return item.status === 0; });

  if (user.transactionsSent && user.transactionsReceived && user.transactionsAPI)
    AllTransactions = [...user.transactionsSent,...user.transactionsReceived,...user.transactionsAPI]

  AllTransactions = AllTransactions.sort( function(a,b) { 
    let c = new Date(a.updated_at); let d = new Date(b.updated_at); return d-c; 
  } ).slice(0, 8);    

  return <div className="container">
    <div className="row mobile_row">

      <div className="row dashboard">

        <Header notification notificationNumber={Notifications.length} menu/>
        <div className="col-12 mobile_col text-center">
          
          { (balance || balance == 0) && <h1> <small>Available Balance</small> <br /> <b>{balance}€</b> <br /> <br /> </h1> }

          { (!balance && balance != 0 && userAccounts == 0) && 
            <h1> 
              <Link to="/add-account">
                Upload a bank account to start
              </Link>
            </h1>
           }

          { (!balance && balance != 0 && userAccounts > 0) && 
            <h3> 
              <Link to="/add-account">
                Change one account to primary, so it can be used for payments and requests
              </Link>
            </h3>
           }

        </div>
      </div>


      <div className="col-12 mobile_col text-center transactions">
        <p>Recent Activity</p>  
        <ul>
          { AllTransactions.map( (item,index) => {
            return <Transaction key={index} transaction={item} />
          } ) }
        </ul>      
      </div>

      <div className="col-12 mobile_col text-center">
        <Link className="btn btn-primary w-100 mb-3" to="/send-payment">
          Send payment
        </Link>
        <br />
        <Link className="btn btn-outline-primary w-100 mb-3" to="/request-payment" >
          Request payment
        </Link>
      </div>
    </div>
  </div>
}
