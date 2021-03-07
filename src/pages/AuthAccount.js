import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useHistory, useParams, useLocation } from "react-router-dom"

import Loading from '../components/Loading';
import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"

export default function AddAccount() {
  const { bank } = useParams();
  let history = useHistory();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [accounts, setAccounts] = useState("");

  const createAccount = () => {
    setStep(1) 
    axios.post( process.env.REACT_APP_API_URL+"bank_accounts/", {},
      {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }}
    ).then( (response) => {
      setSuccess("Bank Account added successfully"); setStep(2)
    })
    .catch((error) => {
      setError(error.response.data.code)
      setStep(-1)
    });
  }

  

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  const getAccounts = () => {
    setStep(1) 

    switch (bank) {
      case "deutschebank":

        axios.post( "https://simulator-api.db.com/gw/oidc/token/", {
          grant_type: 'authorization_code',
          code: query.get("code"),
          // redirect_uri: process.env.REACT_APP_APP_URL+"add-account/deutschebank/"
        }, {
          headers: { Authorization: `Basic ${btoa(process.env.REACT_APP_deutschebank_client+":"+process.env.REACT_APP_deutschebank_secret)}` }
        } ).then( (response) => {
          console.log(response)
          // setSuccess("Bank Account added successfully"); setStep(2)
        })
        .catch((error) => {
          setError(error.message)
          setStep(-1)
        });

        /*

        axios.get( "https://simulator-api.db.com:443/gw/dbapi/banking/cashAccounts/v2",
          {headers: { Authorization: `Bearer ${query.get("code")}` }}
        ).then( (response) => {
          console.log(response)
          // setSuccess("Bank Account added successfully"); setStep(2)
        })
        .catch((error) => {
          setError(error.message)
          setStep(-1)
        });
        */
        break;

      case "rabobank":
        axios.post( "https://api-sandbox.rabobank.nl/openapi/sandbox/oauth2/token",{
          grant_type: 'authorization_code',
          code: query.get("code"),
          redirect_uri: process.env.REACT_APP_APP_URL+"add-account/rabobank"
        }, { 
          headers: { 
            accept: 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(process.env.REACT_APP_rabobank_client+":"+process.env.REACT_APP_rabobank_secret)}`,
          }
        }).then( (response) => {
          console.log(response)
          // setSuccess("Bank Account added successfully"); setStep(2)
        })
        .catch((error) => {
          setError(error.message)
          setStep(-1)
        });
        break;

      case "neonomics":
        break;

      default:
        break;
    }
    setStep(0) 
  }

  useEffect(() => getAccounts(), [])

  return (
    <VelocityTransitionGroup enter={{animation: "fadeIn", duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
      { (step === -1) && <ErrorScreen error={error} />}
      { (step === 0)  && 
        <div className="container">
          <div className="row mobile_row">
            <Header back> Add Account. </Header>

            <div className="col-12 mobile_col">

              
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

