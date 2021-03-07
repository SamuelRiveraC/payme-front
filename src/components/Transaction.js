import React from 'react'

export default function Transaction({transaction}) {

    const d = new Date(transaction.updated_at);
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    const transactionDate = `${da}-${mo}-${ye}`
    const user = JSON.parse(localStorage.getItem('user')).user;

  return (  
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
			{user.id === transaction.user_sender_id && "-"} {transaction.amount}€	
    	</div>
    </li>
  );
}