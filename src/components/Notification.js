import React, { useState } from 'react';
import { useHistory } from "react-router-dom"
import axios from 'axios' 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function Notification({notificationProp}) {
  const [notification, setNotification] = useState(notificationProp);

  const d = new Date(notification.updated_at);
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  const notificationDate = `${da}-${mo}-${ye}`

  let history = useHistory();

  const read = () => {
    if (notification.type === 0 && notification.status === 0) {
      history.push("/request/"+notification.transaction_id)
      return true
    }

    if (notification.status === 0) {
      let newNotification ={ ...notification}
      newNotification.status = newNotification.status === 0 ? 1 : 0
      
      axios.put( process.env.REACT_APP_API_URL+"notifications/"+notification.id, 
        {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }},
        {status: notification.status}
      )
      .then(({ data }) => {
        setNotification(newNotification)
      })
      .catch((error) => {
        alert(error.response.data.code)
      });      
    }

  }

  return (

      <button onClick={read} className={notification.status === 0 ? "link row notification unread" : "link row notification"}>

        <div className="col-10 text-left">
	        {notification.type === 0 && 
            <b> {notification.transaction.receiver.first_name} {notification.transaction.receiver.last_name} has requested a payment for {notification.transaction.amount}€ </b>}
	        {notification.type === 1 && 
            <b> You have received {notification.transaction.amount}€ from {notification.transaction.sender.first_name} {notification.transaction.sender.last_name} </b>}
	        <br />
	        <small> {notificationDate} </small>
        </div>
        <div className="col-2 text-right">
	        <FontAwesomeIcon size="lg" icon={faChevronRight} />
        </div>

      </button>
  );
}
