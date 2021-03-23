import React, { useState, useEffect } from 'react';
import { useParams  } from 'react-router-dom';
import BackButton from '../components/BackButton';
import axios from 'axios';

export default function PaymentDetails({data,handlePayment}) {
  	const { transactionID } = useParams();
  	const UserToken = JSON.parse(localStorage.getItem('user')).token
	const [User, setUser] = useState(JSON.parse(localStorage.getItem('user')).user  ?? {});
	const [BankAccount, setBankAccount] = useState(JSON.parse(localStorage.getItem('BankAccounts'))
		.find((account)=> {
	  return account.primary === "true"
	}) ?? {});

	const [CounterParty, setCounterParty] = useState(data.user ?? {});
	const [CounterBankAccountParty, setCounterBankAccountParty] = useState(data.user.bankAccounts ? 
		data.user.bankAccounts.find((account)=> {
	  return account.primary === "true"
	}) : {});

	const [Amount, setAmount] = useState(data.amount ?? 0)

	const handleMethod = () => {
		if (transactionID) {
			axios.post( process.env.REACT_APP_API_URL+"get-transaction/", {
				type: transactionID && "Payment",
				transaction: transactionID&&transactionID
			},
			{ headers: { Authorization: `Bearer ${UserToken}` } 
			}).then( (response) => {

				setUser(response.data.sender);
				setBankAccount(response.data.sender.bankAccounts.find((account)=> {
				  return account.primary === "true"
				}) ?? {});
				setCounterParty(response.data.receiver);
				setCounterBankAccountParty(response.data.receiver.bankAccounts.find((account)=> {
				  return account.primary === "true"
				}) ?? {});

				setAmount(response.data.amount)
			}).catch((error) => {
				console.error(error.response)
			});
		}
	}
  	useEffect(() => handleMethod(), [])

  return(
    <div className="container">
      <div className="row mobile_row">

        <div className="col-12 mobile_col">
          <div className="row">
            <div className="col-6">
              <BackButton /> 
            </div>
            <div className="col-12 mt-5 mobile_col title d-flex justify-content-between">
              Confirm Payment
            </div>
          </div>
        </div>


        <div className="col-12 mobile_col">
          <div className="form-outline mb-3">
            <b>From User:</b> {User.first_name ?? null} {User.last_name ?? null} <br/>
            <b>Account:</b> {BankAccount.alias ?? null} <br/>
            <b>IBAN:</b> {BankAccount.iban ?? null} <br/>
			<br/>

            <b>To User:</b> {CounterParty.first_name} {CounterParty.last_name} <br/> 
            <b>Account:</b> {CounterBankAccountParty.alias ?? null} <br/>
            <b>IBAN:</b> {CounterBankAccountParty.iban ?? null} <br/>
			<br/>
			
            <b>Amount:</b> {Amount}€ <br/> 
          </div>
        </div>

        <div className="col-12 mobile_col">
          <button className="btn btn-primary w-100 mb-3" onClick={() => handlePayment(Amount)}>
            Confirm payment
          </button>
        </div>


      </div>
    </div>

  )
}

