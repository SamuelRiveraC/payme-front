import React from 'react';
import Header from '../components/Header';
import Notification from '../components/Notification';
import { useHistory } from "react-router-dom"
import axios from 'axios';

export default function NotificationsComponent({Notifications}) {
  const UserToken = JSON.parse(localStorage.getItem('user'))?.token
  let history = useHistory()

  function clear() {

    axios.post( process.env.REACT_APP_API_URL+"notification-clear/", {},
    { headers: { Authorization: `Bearer ${UserToken}` } 
    }).then( (response) => {
      history.goBack() 
    }).catch((error) => {
      alert("Couldn't mark all notifications as read ")
    });  

  }

  return <div className="container">
      <div className="row mobile_row">

        <Header back>

          <div className="row justify-content-between" style={{lineHeight:"48px"}}>
            <div className="col-6">
              Notifications 
            </div>
    
            <div className="col-6 text-right">
              <button className="btn btn-sm btn-outline-primary py-0"
                onClick={()=>clear()}> 
                Clear notifications
              </button>
            </div>
          </div>
        </Header>

        <div className="col-12 mobile_col">
          <ul className="notification">
            { Notifications.map( (item,index) => {
              return <Notification key={index} notificationProp={item} />
            } ) }
          </ul>      
        </div>

        <div className="col-12 mobile_col">
      		<br/>
      	</div>

      </div>
    </div>
}