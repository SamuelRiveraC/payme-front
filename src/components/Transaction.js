import React from 'react'

export default function Transaction({transaction}) {

    const d = new Date(transaction.updated_at);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const transactionDate = `${da}-${mo}-${ye}`
    const user = JSON.parse(localStorage.getItem('user')).user;

    // NEW MODEL DEPENDING ON WHO DEBITS AND CREDITS

    return transaction.fetch_type === "debit" || transaction.fetch_type === "credit" ? 

    <li className="row"> 
        <div className="col-2 text-left image">
            <img src={"https://via.placeholder.com/160/29363D/EDF4FC?text="+transaction.party.slice(0,2)} height={60} alt="transaction" />
        </div>
        <div className="col-6 text-left information">
            <b> * {transaction.party} </b>
            <br /> <small> {transactionDate} </small>
        </div>
        <div className="col-4 text-right amount">
            {transaction.fetch_type === "debit" && "-"} {transaction.amount.toFixed(2)}€    
        </div>
    </li>

    :

    <li className="row">
    	<div className="col-2 text-left image">
            {user.id === transaction.sender.id   && <img src={transaction.receiver.profile_picture  } height={60} alt="transaction" />}
            {user.id === transaction.receiver.id && <img src={transaction.sender.profile_picture} height={60} alt="transaction" />}
    	</div>
    	<div className="col-6 text-left information">
            {user.id === transaction.sender.id   && <b> {transaction.receiver.first_name} {transaction.receiver.last_name} </b> }
			{user.id === transaction.receiver.id && <b> {transaction.sender.first_name} {transaction.sender.last_name} </b> }
            <br /> <small> {transactionDate} </small>
    	</div>
    	<div className="col-4 text-right amount">
			{user.id === transaction.user_sender_id && "-"} {transaction.amount.toFixed(2)}€	
    	</div>
    </li>
}