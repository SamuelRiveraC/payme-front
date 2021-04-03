import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Placeholder from "../img/Placeholder.png"

import Header from '../components/Header';

function Settings({logout, user}) {

  return <div className="container">
      <div className="row mobile_row">
        <Header back>
          <div className="profile">
            <img src={Placeholder} alt="profile" /> { `${user.first_name} ${user.last_name}` }
          </div>
        </Header>

        
        <div className="col-12 mobile_col">
          <ul className="settings">
            <li> 
              <Link to="/accounts">
                My accounts <FontAwesomeIcon size="lg" icon={faChevronRight} />
              </Link>
            </li>
            <li> 
              <Link to="/add-account">
                Add account <FontAwesomeIcon size="lg" icon={faChevronRight} />
              </Link>
            </li>
            <li> 
              <Link to="/settings">
                Support <FontAwesomeIcon size="lg" icon={faChevronRight} />
              </Link>
            </li>
            <li> 
              <Link to="/settings">
                Legal <FontAwesomeIcon size="lg" icon={faChevronRight} />
              </Link>
            </li>
            <li> 
              <Link to="/settings">
                Invite Friends <FontAwesomeIcon size="lg" icon={faChevronRight} />
              </Link>
            </li>
            <li> 
              <button className="link" onClick={ logout } style={{
                display: "flex", justifyContent: "space-between", 
                width: "100%", height: "60px", 
                margin: 0, padding: 0,
                lineHeight: "60px", 
                color: "#29363D"
              }}> 
                Logout <FontAwesomeIcon size="lg" icon={faChevronRight} />
              </button>
            </li>
          </ul>      
        </div>

        <div className="col-12 mobile_col text-center" 
          onClick={() => {navigator.clipboard.writeText(`${process.env.REACT_APP_APP_URL}user/${user.slug}`)}} > 

          <a href={`${process.env.REACT_APP_APP_URL}user/${user.slug}`}>
            {`${process.env.REACT_APP_APP_URL}user/${user.slug}`}
          </a>

          <br/> <br/>

          <QRCode value={`${process.env.REACT_APP_APP_URL}user/${user.slug}`} />
        </div>
      </div>
    </div>
}

export default Settings;
