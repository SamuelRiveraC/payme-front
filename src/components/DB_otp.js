import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faBackspace } from '@fortawesome/free-solid-svg-icons'

export default function DB_otp({iban,amount,setOTP,backStep}) {
	const [ID, setID] = useState();
	const [authkey, setAuthKey] = useState();
	
	let key = JSON.parse(localStorage.getItem('user'))?.keys?.deutschebank?.access_token



  const executeOTPMethod = () => {
	if (!key) {
   		alert("No Key")
   		return false
   	}
  	axios.post( "https://simulator-api.db.com:443/gw/dbapi/others/onetimepasswords/v2/single",
	  {
	    "method": "PHOTOTAN",
	    "requestType": "INSTANT_SEPA_CREDIT_TRANSFERS",
	    "requestData": {
			type:"challengeRequestDataInstantSepaCreditTransfers",
			targetIban: iban,
	    	amountValue: amount,
	    	amountCurrency: "EUR",
	    }
	  },
      {headers: { Authorization: `Bearer ${key}` }}
    ).then( (response) => {
      setID(response.data.id)
    })
    .catch((error) => {
    	alert(error.response.message)
    });
  }

  const answerOTPMethod = () => {
	if (!key) {
   		alert("No Key")
   		return false
   	}
  	axios.patch( "https://simulator-api.db.com:443/gw/dbapi/others/onetimepasswords/v2/single/"+ID,
	  { "response": authkey },
      {headers: { Authorization: `Bearer ${key}` }}
    ).then( (response) => {
      setOTP(response.data.otp)
	})
    .catch((error) => {
    	alert(error.response.status)
    });

  }

  useEffect(() => executeOTPMethod(), [])



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
              <span> Authorize the transaction  {JSON.stringify(ID)} </span>
            </div>
          </div>
        </div>

        <div className="col-12 mobile_col">
          <div className="form-outline mb-3">
          	<label> Insert the authorization code at your Authy app</label>
            <input type="text" className="form-control" onChange={e => setAuthKey(e.target.value)} />
          </div>
        </div>

        <div className="col-12 mobile_col ">
          <button className="btn btn-primary w-100 mb-3" onClick={answerOTPMethod}>
            Authorize transaction
          </button>
        </div>

      </div>
	</div>
}
