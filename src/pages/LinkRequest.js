import React, { useState, useEffect } from 'react';
import { useParams  } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"

export default function LinkRequest() {
  let { id } = useParams();
  const [step, setStep] = useState(0); 
  const [user, setUser] = useState(0); 	
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(0);
  const [userAndTransactionData, setUserAndTransactionData] = useState({ userName: "", amount: "", profile_picture: "" })

  const handleTransaction = () => {
    axios.put( process.env.REACT_APP_API_URL+"transactions/"+id, {} ,
        {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }}
      ).then( (response) => {
        setUserAndTransactionData({
          userName: `${response.data.receiver.first_name} ${response.data.receiver.last_name}`,
          profile_picture:response.data.receiver.profile_picture,
          amount: `${response.data.amount}€`
        })
        setStep(1)
      })
      .catch((error) => {
        setStep(-1)
        // SAME USER, SEND MONEY AND FAIL, NOT FOUND TRANSF
        setError(error.response.data.code)
      });
  }

  //RUN ONCE WTF
  useEffect(() => handleTransaction(), [])

  return <div>
    <VelocityTransitionGroup enter={{animation:"fadeIn",duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
    { (step === -1) && <ErrorScreen error={error} />}
    { (step === 0)  && <Loading />}
  	{ (step === 1)  && <SuccessScreen operation="paid" data={userAndTransactionData}/>}
    </VelocityTransitionGroup>
  </div>
}