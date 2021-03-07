import React from 'react';
import BackButton from '../components/BackButton';
import MenuButton from '../components/MenuButton';
import NotificationButton from '../components/NotificationButton';


export default function Header({children, back, menu, notification, notificationNumber}) {

  return(
    <div className="col-12 mobile_col header">
      <div className="row">
        <div className="col-6">
        	{ back && <BackButton /> }
        	{ notification && <NotificationButton notificationNumber={notificationNumber}/> }
        </div>
        <div className="col-6 text-right">
        	{ menu && <MenuButton /> }
        </div>

        { children && <div className="col-12 mt-5 title"> {children} </div> }

      </div>
    </div>
  )
}

