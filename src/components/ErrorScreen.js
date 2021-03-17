import React from 'react';
import { Link } from 'react-router-dom';

export default function ErrorScreen({error, tryAgain}) {
  const getError = () => {
    if (error === "E_ROW_NOT_FOUND")
      return "This item was not found"
    else if (error === "E_ROW_SAME_USER" || error === "E_SAME_USER")
      return "You can't send a transaction or request to yourself"
    else if (error === "E_TRANSACTION_PAID")
      return "This transaction has been already paid"
    else if (error === "E_TRANSACTION_CANCELLED")
      return "This transaction was cancelled"
    else if (error === "E_SENDER_NO_BANK_ACCOUNT")
      return "Sender has no a connected bank account"
    else if (error === "E_RECEIVER_NO_BANK_ACCOUNT")
      return "Receiver has no a connected bank account"
    else if (error === "E_INSUFFICIENT_FUNDS")
      return "Insufficient funds to make this transaction"
    else if (error === "E_USER_WRONG_TRANSACTION_ID")
      return "You have no access to this transaction"
    else
      return error
  }
  return(
    <div className="container">
      <div className="row mobile_row">

        <div className="col-12 mobile_col text-center">
          <h1 className="validation__error mb-5">
            { getError() } 
          </h1>

          <Link className="btn btn-outline-primary w-100 mt-5" to="/">
            Go to Main Menu
          </Link>
        </div>

      </div>
    </div>

  )
}

