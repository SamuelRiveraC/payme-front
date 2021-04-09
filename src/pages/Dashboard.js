import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Transaction from '../components/Transaction';

export default function Dashboard({user, BankAccounts, Transactions, Notifications, triggerRefresh}) {

  let balance = 0
  if (BankAccounts && Array.isArray(BankAccounts)) {
    balance = BankAccounts.find(item => item.primary === "true")?.balance;
  }

  const AllTransactions = Transactions.sort ( function(a,b) { 
    let c = new Date(a.updated_at); let d = new Date(b.updated_at); return d-c; 
  } )


  return <div className="container">
    <div className="row mobile_row">

      <div className="row dashboard">

        <Header notification notificationNumber={Notifications.length} menu triggerRefresh={()=>triggerRefresh()}/>
        <div className="col-12 mobile_col text-center">

          { (balance || balance == 0) ? <h1> <small>Available Balance</small> <br /> <b>{balance}€</b> <br /> <br /> </h1> : <p> No account available </p>}

        </div>
      </div>


      <div className="col-12 mobile_col text-center transactions">
        <p>Recent Activity</p>
        <ul>
          { (balance || balance == 0) && AllTransactions.map( (item,index) => {
            return <Transaction key={index} transaction={item} />
          } ) }
        </ul>      
      </div>

      <div className="col-12 mobile_col text-center">

        { (!balance && balance != 0 && BankAccounts.length == 0) && 
            <Link className="btn btn-primary w-100 mb-3 mt-5" to="/add-account">
              Register a Bank account to start using PayMe
            </Link>
         }

        { (!balance && balance != 0 && BankAccounts.length > 0) && 
            <Link className="btn btn-primary w-100 mb-3 mt-5" to="/add-account">
              Change one account to primary, so it can be used for payments and requests
            </Link>
         }


        {(balance || balance == 0) && <Link className="btn btn-primary w-100 mb-3" to="/send-payment"> Send payment </Link> }
        <br />
        {(balance || balance == 0) && <Link className="btn btn-outline-primary w-100 mb-3" to="/request-payment" > Request payment </Link> }

      </div>
    </div>
  </div>
}
