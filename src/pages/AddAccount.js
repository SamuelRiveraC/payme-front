import React, { useState } from 'react';
import Qs from "qs"
import axios from 'axios';
import Header from '../components/Header';
import { useHistory } from "react-router-dom"

import Loading from '../components/Loading';
import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"


export default function AddAccount() {
  let history = useHistory();

  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [provider, setProvider] = useState("payme")

  const createAccount = () => {
    setStep(1) 

    const catchError = error => {
      setError("Check the console")
      console.error(error)
      setStep(-1)
    }
    switch (provider) {
      case "payme":
        axios.post( process.env.REACT_APP_API_URL+"bank_accounts/", {bank:"payme"},
          {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }}
        ).then( (response) => {
          setSuccess("PayME Test Bank Account with €1000 added successfully"); setStep(2)
        }).catch(error => catchError(error.response) );
        break;

      case "deutschebank":
        window.location.href = `https://simulator-api.db.com/gw/oidc/authorize?response_type=code&redirect_uri=${process.env.REACT_APP_APP_URL+"add-account/deutschebank/"}&client_id=${process.env.REACT_APP_deutschebank_client}` 
        break;

      case "rabobank":
        //remove trailing slash / 
        window.location.href = `https://api-sandbox.rabobank.nl/openapi/sandbox/oauth2/authorize?client_id=${process.env.REACT_APP_rabobank_client}&response_type=code&scope=ais.balances.read%20ais.transactions.read-90days&redirect_uri=${process.env.REACT_APP_APP_URL.slice(0, -1)}/add-account/rabobank`
        break;

      case "neonomics":
        axios.post( "https://sandbox.neonomics.io/auth/realms/sandbox/protocol/openid-connect/token", 
        Qs.stringify({
          grant_type: "client_credentials",
          client_id: process.env.REACT_APP_neonomics_client,
          client_secret: process.env.REACT_APP_neonomics_secret,
        }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
        .then( (response) => {

          console.log(response)
          setStep(0) 

        }).catch((error) => catchError(error.response));
        break;

      case "klarna":
        break;
      default:
        break;
    }
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
      { (step === 1)  && <Loading />}
      { (step === 2)  && <SuccessScreen account={success}/>}
    </VelocityTransitionGroup>





  )
}

