import React from 'react';
import Header from '../components/Header';
import Notification from '../components/Notification';

export default function Notifications({user}) {
  
  //SHOULD BE LOADED ASYNC => NOTIFICATIONS

  const notifications = user.notifications.sort(function(a, b) {
    return a.status - b.status;
  }).sort( function(a,b) { 
    let c = new Date(a.updated_at);
    let d = new Date(b.updated_at);
    return d-c; 
  } )


  return <div className="container">
      <div className="row mobile_row">

        <Header back>
          Notifications
        </Header>

        <div className="col-12 mobile_col">
          <ul className="notification">
            { notifications.map( (item,index) => {
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