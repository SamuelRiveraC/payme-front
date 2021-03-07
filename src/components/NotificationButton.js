import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'

export default function NotificationButton({notificationNumber}) {
	return 	<Link to="/notifications" style={{position:"relative"}}> 
        <FontAwesomeIcon size="lg" icon={faBell} style={{height:60}}/>
        {notificationNumber > 0 && <div className="notification__number"> {notificationNumber} </div> }
	</Link>
}
