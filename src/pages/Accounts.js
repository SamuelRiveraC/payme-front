import React from 'react';
import { Link } from 'react-router-dom';
import BankAccount from '../components/BankAccount';
import Header from '../components/Header';

export default function Accounts({BankAccounts}) {
  const accounts = BankAccounts
  
  return(
    <div className="container">
      <div className="row mobile_row">

        <Header back> My Accounts </Header>

        <div className="col-12 mobile_col">
          <ul className="account">
            { accounts.map( (item,index) => {
              return <BankAccount key={index} account={item} />
            } ) }
          </ul>
        </div>

        <div className="col-12 mobile_col text-center">
          <Link className="btn btn-primary w-100 mb-3" to="/add-account">
            Add account 
          </Link>
        </div>
      </div>
    </div>

  )
}

