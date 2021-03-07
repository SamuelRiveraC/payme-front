import React, { useState } from 'react';
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
  const [provider, setProvider] = useState("")

  const createAccount = () => {
    setStep(1) 

    const catchError = error => {
      console.error(error)
      setStep(-1)
      setError("Check the console")
    }
    switch (provider) {
      case "payme":
        axios.post( process.env.REACT_APP_API_URL+"bank_accounts/", {},
          {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }}
        ).then( (response) => {
          setSuccess("PayME Test Bank Account with €1000 added successfully"); setStep(2)
        }).catch(error => catchError(error) );
        break;

      case "deutschebank":
        window.location.href = `https://simulator-api.db.com/gw/oidc/authorize?response_type=code&redirect_uri=${process.env.REACT_APP_APP_URL+"add-account/deutschebank/"}&client_id=${process.env.REACT_APP_deutschebank_client}` 
        break;

      case "rabobank":
        //remove trailing slash / 
        window.location.href = `https://api-sandbox.rabobank.nl/openapi/sandbox/oauth2/authorize?client_id=${process.env.REACT_APP_rabobank_client}&response_type=code&scope=ais.balances.read%20ais.transactions.read-90days&redirect_uri=${process.env.REACT_APP_APP_URL.slice(0, -1)}/add-account/rabobank`
        break;

      case "neonomics":
        // window.location.href = `https://simulator-api.db.com/gw/oidc/authorize?response_type=code&redirect_uri=${process.env.REACT_APP_APP_URL}&client_id=${process.env.REACT_APP_deutschebank_client}` 
        axios.post( "https://sandbox.neonomics.io/auth/realms/sandbox/protocol/openid-connect/token", {
          grant_type: "client_credentials",
          client_id: process.env.REACT_APP_neonomics_client,
          client_secret: process.env.REACT_APP_neonomics_secret,
        }).then( (response) => {
          console.log(response)
          setStep(0) 
        })
        .catch((error) => {
          console.log(error)
          setStep(0) 
        });
        break;

      default:
        break;
    }

    /*
        axios.get( "", {}, {} ).then( (response) => {
        }).catch(error => catchError(error) );
    */
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
                <option value="payme"> PayMe Test Bank </option>
                <option value="deutschebank"> Deutsche Bank </option>
                <option value="rabobank"> Rabobank </option>
                <option value="neonomics" > Neonomics banking aggregator </option>
                <option value="klarna" disabled> Klarna banking aggregator </option>
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

