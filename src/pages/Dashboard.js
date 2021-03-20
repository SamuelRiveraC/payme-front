import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Transaction from '../components/Transaction';

export default function Dashboard({user, BankAccounts, Transactions, Notifications}) {

  let balance = 0
  if (BankAccounts && Array.isArray(BankAccounts)) {
    balance = BankAccounts.find(item => item.primary === "true")?.balance;
  }



  return <div className="container">
    <div className="row mobile_row">

      <div className="row dashboard">

        <Header notification notificationNumber={Notifications.length} menu/>
        <div className="col-12 mobile_col text-center">
          { (balance || balance == 0) && <h1> <small>Available Balance</small> <br /> <b>{balance}€</b> <br /> <br /> </h1> }

          { (!balance && balance != 0 && BankAccounts.length == 0) && 
            <h1> 
              <Link to="/add-account">
                Upload a bank account to start
              </Link>
            </h1>
           }

          { (!balance && balance != 0 && BankAccounts.length > 0) && 
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
          { Transactions.map( (item,index) => {
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
