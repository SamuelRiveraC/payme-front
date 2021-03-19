import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faBackspace } from '@fortawesome/free-solid-svg-icons'

export default function AuthorizeTransaction({handleAuthorization, backStep}) {
	const [authkey, setAuthKey] = useState();

  const authorize = () => {
    handleAuthorization("deutschebank",authkey)  
  }



  return     <div className="container">
      <div className="row mobile_row">

        <div className="col-12 mobile_col">
          <div className="row">
            <div className="col-6">
              { backStep ? <button className="link" onClick={backStep}>
                <FontAwesomeIcon size="lg" icon={faChevronLeft} />
              </button> : <Link to="/">
                <FontAwesomeIcon size="lg" icon={faChevronLeft} />
              </Link>
              }
            </div>
            <div className="col-6 mt-5 mobile_col title d-flex justify-content-between">
              <span> Authorize the transaction</span>
            </div>
          </div>
        </div>

        <div className="col-12 mobile_col">
          <div className="form-outline mb-3">
          	<label> Insert the authorization code</label>
            <input type="text" className="form-control" onChange={e => setAuthKey(e.target.value)} />
          </div>
        </div>

        <div className="col-12 mobile_col ">
          <button className="btn btn-primary w-100 mb-3" onClick={() => authorize()}backStep >
            Authorize transaction
          </button>
        </div>

      </div>
	</div>
}
