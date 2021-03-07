import React, { useState, useEffect } from 'react';
import axios from "axios"
import Header from '../components/Header';
import { useParams, useHistory } from "react-router-dom"

import Loading from '../components/Loading';
import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"

export default function Account() {
  const { id } = useParams();
  let history = useHistory();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [account, setAccount] = useState({}) 
  const [checked, setChecked] = useState(false)

  const handlePrimarySwitch = () => {
    setChecked(!checked)
    updateAccount({primary: checked ? "false" : "true"})
  }

  const getAccount = () => {
      axios.get( process.env.REACT_APP_API_URL+"bank_accounts/"+id,
      {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }}
    ).then( (response) => {
      setStep(0)
      setAccount(response.data) 
      setChecked(response.data.primary==="true"?true:false)
    })
    .catch((error) => {
      setError(error.response.data.code)
      setStep(-1)
    });
  }

  // BETTER SUCCESS PAGES MY DUDE
  const updateAccount = (typeOfUpdate) => {
      axios.put( process.env.REACT_APP_API_URL+"bank_accounts/"+id, typeOfUpdate,
      {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }}
    ).then( (response) => {
      if (typeOfUpdate.primary) {
        setSuccess("Account updated successfully")
      } else {
        setSuccess("Account consent renewed for the next 3 months successfully")
      }
      setAccount(response.data) 
      setChecked(response.data.primary === "true" ? true : false)
      setStep(2)
    })
    .catch((error) => {
      setError(error.response.data.code)
      setStep(-1)
    });
  }

  // BETTER SUCCESS PAGES MY DUDE
  const deleteAccount = () => {
      axios.delete( process.env.REACT_APP_API_URL+"bank_accounts/"+id, 
      {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }}
    ).then( (response) => {
      setSuccess("Account deleted successfully")
      setStep(2)
    })
    .catch((error) => {
      setError(error.response.data.code)
      setStep(-1)
    });
  }

  useEffect(() => getAccount(), [])

  let d , ye, mo, da, updated_at, expires_at

  if (account.updated_at) {
    d  = new Date( account.updated_at );
    ye = Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    mo = Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    updated_at = `${da}-${mo}-${ye}`
  }
  if (account.expires_at) {
    d  = new Date( account.expires_at );
    ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
    da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    expires_at = `${da}-${mo}-${ye}`
  }

  return(
    

    <VelocityTransitionGroup enter={{animation: "fadeIn", duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
    { (step === -1) && <ErrorScreen error={error} />}
    { (step === 0)  && 
      <div className="container">
        <div className="row mobile_row">
          <Header back> Account Name </Header>
          <div className="col-12 row mobile_col account">
            <div className="col-12 text-left information">
              <b> Alias </b> <br /> <small> {account.alias} </small>
            </div>
          </div>
          <div className="col-12 row mobile_col account">
            <div className="col-12 text-left information">
              <b> IBAN </b> <br /> <small> {account.iban}  </small>
            </div>
          </div>
  
          <div className="col-12 row mobile_col account">
            <div className="col-12 text-left information">
              <b> Current balance </b> <br /> <small> {account.balance}€  </small>
            </div>
          </div>
  
          <div className="col-12 row mobile_col account">
            <div className="col-12 text-left information">
              <b> BIC / Swift </b> <br /> <small> {account.bic} </small>
            </div>
          </div>
  
          <div className="col-12 row mobile_col account">
            <div className="col-12 text-left information">
              <b> Last time renewed </b> <br /> <small> {account && updated_at} </small>
            </div>
          </div>
  
          <div className="col-12 row mobile_col account">
            <div className="col-12 text-left information">
              <b> Consent expires by </b> <br /> <small> {account && expires_at} </small>
            </div>
          </div>
  
          <div className="col-12 row mobile_col account">
            <div className="col-8 text-left information">
              <b> Set as primary Account </b>
              <br/>
            </div>
            <div className="col-4 text-left information">
              <label className="switch">
                <input type="checkbox" checked={checked} onClick={()=>handlePrimarySwitch()} />
                <div className="slide"></div>
              </label>
            </div>
          </div>
  
          <div className="col-12 mobile_col text-center">
            <button className="btn btn-primary w-100 mb-3" onClick={()=>updateAccount({expires_at:true})}>
              Renew account 
            </button>
            <button className="btn btn-outline-primary w-100 mb-3" onClick={()=>deleteAccount()}>
              Delete account 
            </button>
          </div>
        </div>
      </div>
    }
    { (step === 1)  && <Loading />}
    { (step === 2)  && <SuccessScreen account={success}/>}
    </VelocityTransitionGroup>

  )
}

