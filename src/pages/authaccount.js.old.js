import React, { useState, useEffect } from 'react';
import Qs from "qs"
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

  const getAccounts = () => {
    let user = JSON.parse(localStorage.getItem('user'))
                
    if (user.keys?.deutschebank) {
        let access_token = user?.keys?.deutschebank?.access_token

        if  (!access_token) {
          setError("No Token");
          setStep(-1);
        }

        axios.get( "https://simulator-api.db.com/gw/dbapi/v1/cashAccounts",
          {headers: { Authorization: `Bearer ${access_token}` }} //response.data.access_token
        ).then( (response) => {
          setAccounts(response.data)

          axios.post( process.env.REACT_APP_API_URL+"bank_accounts/", {
            bank:"deutschebank", bank_accounts: response.data,
          },
            {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }}
          ).then( (response) => {
            setSuccess("Deutschebank bank accounts added successfully"); setStep(2)
          }).catch(error => {setError(error.message); setStep(0)});
          
        })
        .catch((error) => {
          setError(error.message)
          if (error.response.status === 401) {
            delete user.keys.deutschebank
            localStorage.setItem('user', JSON.stringify(user))
          }
          setStep(-1)
        });
    }


    if (user.keys?.rabobank) {
        let access_token = user?.keys?.rabobank?.access_token

        if  (!access_token) {
          setError("No Token");
          setStep(-1);
        }
        const { v4: uuidv4 } = require('uuid');

        axios.get( "https://api-sandbox.rabobank.nl/openapi/sandbox/payments/account-information/ais/accounts",
          {headers: {
              Authorization: `Bearer ${access_token}`, 
              accept: `application/json`, 
              date: `${new Date().toUTCString()}`, 

              //digest: `sha-512=${btoa(BinarySHA512(""))}`,
              

              "psu-ip-address": ``, //There is no limit in amount of calls
              
              //AIS = date+digest+x-request-id
              signature: ``, //For description and examples check the documentation section.


              "tpp-signature-certificate": process.env.REACT_APP_rabobank_signing_cer,
              "x-ibm-client-id": process.env.REACT_APP_rabobank_client, 
              "x-request-id": uuidv4(), // CREATE UUID ¿just because? 
          } } //response.data.access_token
        ).then( (response) => {
          setAccounts(response.data)

          /*
          //PIS = date+digest+x-request-id+tpp-redirect-uri (mandatory for ‘HTTP POST request)

          --header 'digest: REPLACE_THIS_VALUE' \
          --header 'psu-ip-address: REPLACE_THIS_VALUE' \
          --header 'signature: REPLACE_THIS_VALUE' \

          axios.post( process.env.REACT_APP_API_URL+"bank_accounts/", {
            bank:"rabobank", bank_accounts: response.data,
          },
            {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }}
          ).then( (response) => {
            setSuccess("Rabobank bank accounts added successfully"); setStep(2)
          }).catch(error => {setError(error.message); setStep(0)});
          */
        })
        .catch((error) => {
          setError(error.message)
          if (error.response.status === 401) {
            delete user.keys.rabobank
            localStorage.setItem('user', JSON.stringify(user))
          }
          setStep(-1)
        });
    }


    // history.replace("/accounts")
  }

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }


  let query = useQuery();
  const getAuth = () => {
    // IF HAS TOKENS
    let user = JSON.parse(localStorage.getItem('user'))

    if (user?.keys && user?.keys === {}) {
      console.log(user?.keys, user?.keys !== {}, user?.keys && user?.keys === {})
      getAccounts()
    }
    else if (query.get("code")) {
      setTimeout ( () => {
        switch (bank) {
          case "deutschebank":
              axios.post( process.env.REACT_APP_API_URL+"oauth",{ code: query.get("code"), bank: "deutschebank" })
              .then( (response) => {
                let user = JSON.parse(localStorage.getItem('user'))
                if (!user?.keys)
                  user.keys = {}

                if (response.data.data) {
                  user.keys.deutschebank = response.data.data
                  localStorage.setItem('user', JSON.stringify(user))
                  console.log(user)
                  getAccounts()
                } else {
                  throw new Error("Invalid Authorization Token");
                }
              })
              .catch((error) => {
                setError("Invalid Authorization Token")
                setStep(-1)
              });
            break;
    
          case "rabobank":

            axios.post( process.env.REACT_APP_API_URL+"oauth",{ code: query.get("code"), bank: "rabobank" })
              .then( (response) => {
                let user = JSON.parse(localStorage.getItem('user'))
                if (!user?.keys)
                  user.keys = {}
                if (response.data.data) {
                  user.keys.rabobank = response.data.data
                  localStorage.setItem('user', JSON.stringify(user))
                  console.log(user)
                  getAccounts()
                } else {
                  throw new Error("Invalid Authorization Token");
                }
              })
              .catch((error) => {
                setError("Invalid Authorization Token")
                setStep(-1)
              });
            break;
    
          case "neonomics":
            break;
    
          default:
            history.replace("/accounts")
            break;
        }
      }, 1000 )
    }
  }



  useEffect(() => getAuth(), [])

  return (
    <VelocityTransitionGroup enter={{animation: "fadeIn", duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
      { (step === -1) && <ErrorScreen error={error} />}
      { (step === 0)  && 
        <div className="container">
          <div className="row mobile_row">
            <Header back> Add Account. </Header>

            <div className="col-12 mobile_col">
              {JSON.stringify(accounts)}
              
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams, useLocation } from "react-router-dom"

import Loading from '../components/Loading';
import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"

export default function AddAccount() {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const useQuery = () => { return new URLSearchParams(useLocation().search); }

  let query = useQuery();
  const getAuth = () => {
    setMessage(message)
    if (query.get("result")==="success") {
     setStep(2)      
    } else {
      setStep(-1)
    }
  }
  useEffect(() => getAuth(), [])

  return (
    <VelocityTransitionGroup 
      enter={{animation: "fadeIn", duration:500,delay:600}} 
      leave={{animation: "slideUp",duration:500}} >
      { (step === -1) && <ErrorScreen error={message} />}
      { (step === 1)  && <Loading />}
      { (step === 2)  && <SuccessScreen account={message}/>}
    </VelocityTransitionGroup>





  )
}

