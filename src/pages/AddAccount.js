import React, { useState } from 'react';
import Qs from "qs"
import axios from 'axios';
import Header from '../components/Header';

// import { useHistory } from "react-router-dom"  let history = useHistory();

import Loading from '../components/Loading';
import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"


export default function AddAccount() {

  const [step, setStep] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [provider, setProvider] = useState("payme")

  const createAccount = () => {
    setStep(2) 
    let auth = JSON.parse(localStorage.getItem('user'))?.token
    const catchError = error => {
      console.error(error)
      setError("Check the console")
      setStep(-1)
    }

    if (provider === "payme") {
        //The only one that goes directly
        axios.post( process.env.REACT_APP_API_URL+"bank_accounts/", {bank:provider},
          { headers: { Authorization: `Bearer ${auth}`}
        }).then((response)=>{setSuccess("PayME Test Bank Account with €1000 added successfully");setStep(3)
        }).catch(error => catchError(error.response));
        return true;
    }

    axios.post( process.env.REACT_APP_API_URL+"oauth/", 
      {bank: provider, code: code}, { headers: { Authorization: `Bearer ${auth}`}
    }).then((response)=>{

      console.log(response)

      if ("auth_url" in response.data) {
        window.location.href = response.data.auth_url
      } else if ("consent_url" in response.data) {
        window.location.href = response.data.consent_url
      } else if ("neonomicsBanks" in response.data) {
        //SHOW BANKS STEP SELECT BANKS
        setStep(1)
      } else {
        setSuccess("Bank Accounts added successfully")
        setStep(3)
      }
    }).catch(error => {
      if ("consent_url" in error.response.data) {
        window.location.href = error.response.data.consent_url
      } else {
        setError("Invalid Authorization Token")
        setStep(-1)
      }    
    });
  }







  return (
    <VelocityTransitionGroup enter={{animation: "fadeIn", duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
      { (step === -1) && <ErrorScreen error={error} />}
      { (step === 0)  && 
        <div className="container">
          <div className="row mobile_row">
            <Header back> Add Account </Header>

            <div className="col-12 mobile_col">
              <label className="form-label" >Select Bank</label>
              <select className="form-control" value={provider} onChange={(e)=>setProvider(e.target.value)}>
                <option value="payme" selected> PayMe Test Bank </option>
                <option value="deutschebank"> Deutschebank </option>
                <option value="rabobank"> Rabobank </option>
                <option value="neonomics" > Neonomics </option>
                <option value="klarna" disabled> Klarna </option>
              </select>
            </div>

            <div className="col-12 mobile_col text-center">
              <button className="btn btn-primary w-100 mb-3" onClick={createAccount}>Submit</button>
            </div>
          </div>
        </div>
      }
      { (step === 1)  && <span> Neonomics/Klarna bank accounts </span>}
      { (step === 2)  && <Loading />}
      { (step === 3)  && <SuccessScreen account={success}/>}
    </VelocityTransitionGroup>
  )
}

