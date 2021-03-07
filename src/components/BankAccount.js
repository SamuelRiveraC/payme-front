import React from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

// NEEDS BANKING LOGOS

export default function Accounts({account}) {
  return (

      <Link className="row" to={"/account/"+account.id}>

        <div className="col-10 text-left information">
	        <b> {account.alias} </b> <br /> <span> {account.iban}  </span>
        </div>
        <div className="col-2 text-right amount">
	        <FontAwesomeIcon size="lg" icon={faChevronRight} />
        </div>

      </Link>
  );
}
