import React from 'react';
import BackButton from '../components/BackButton';
import MenuButton from '../components/MenuButton';
import NotificationButton from '../components/NotificationButton';
import logolight from "../img/payme-light.png"
import logo from "../img/payme.png"


export default function Header({children, back, menu, notification, notificationNumber, triggerRefresh}) {

  return(
    <div className="col-12 mobile_col header">
      <div className="row">
        <div className="col-4">
        	{ back && <BackButton /> }
        	{ notification && <NotificationButton notificationNumber={notificationNumber}/> }
        </div>
        <div className="col-4 text-center pt-2">
            {triggerRefresh && <img className="LogoLight" src={logolight} alt="Logo" height="36px" onClick={()=>triggerRefresh()}/>}
            {triggerRefresh && <img className="LogoColor" src={logo} alt="Logo" height="36px" onClick={()=>triggerRefresh()}/>}
        </div>
        <div className="col-4 text-right">
        	{ menu && <MenuButton /> }
        </div>

        { <div className="col-12 mt-5 title">
          {children}
        </div> }

      </div>
    </div>
  )
}

