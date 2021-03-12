import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useParams, useLocation } from "react-router-dom"

import Loading from '../components/Loading';
import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"

//let history = useHistory() history.push("/")
export default function AddAccount() {
  const { bank } = useParams();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  const getAuth = () => {
    let auth = JSON.parse(localStorage.getItem('user'))?.token
    let code = query.get("code")

    
    if (query.get("code")) {
      setTimeout ( () => {


        axios.post( process.env.REACT_APP_API_URL+"oauth",{ code: code, bank: bank },
          {headers: { Authorization: `Bearer ${auth}`} 
        }).then( (response) => {
          if (response.data.data) {
            // IT SHOULD REDIRECT TO HOME AND HOME SHOULD RELOAD ALL THE ACCOUNTS :D
            // localStorage.setItem('user', JSON.stringify(user))
            setSuccess("Your Bank account was added successfully");
            setStep(2)
          } else {
            throw new Error("Invalid Authorization Token");
          }
        }).catch((error) => {
          setError("Invalid Authorization Token")
          setStep(-1)
        });

        axios.post( process.env.REACT_APP_API_URL+"oauth-bank/", { code: code, bank: bank },
          { headers: { Authorization: `Bearer ${auth}`}
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
          setError("Invalid Authorization Token")
          setStep(-1)
        });



      }, 1000 )
    } else {
      setError("No Code was received")
      setStep(-1)
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
            </div>
            <div className="col-12 mobile_col text-center">
              {/*onClick={createAccount}*/}
              <button className="btn btn-primary w-100 mb-3" >Submit</button>
            </div>
          </div>
        </div>
      }
      { (step === 1)  && <Loading />}
      { (step === 2)  && <SuccessScreen account={success}/>}
    </VelocityTransitionGroup>





  )
}


