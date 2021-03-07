import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Loading from '../components/Loading';
import SelectAmount from '../components/SelectAmount';
import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"

export default function LinkUser() {
  let { id } = useParams();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState(0);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(0);
  const [userAndTransactionData, setUserAndTransactionData] = useState({ userName: "", amount: "", profile_picture: "" })


  const getUser = (id) => {
    axios.get( process.env.REACT_APP_API_URL+"users/"+id, 
      {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }}
    ).then(({ data }) => {
      setUser(data)
      setStep(1)
    })
    .catch((error) => {
      setStep(-1)
      setError(error.response.data.code)
    });
  }


  const handleTransaction = (value) => {
  	if (step === 0) {
      if (value <= 0 ) {
        return false
      }
      setStep(2)
    } else if (step === 1) {
      value = parseInt(value, 10)
      setStep(0)

      axios.post( process.env.REACT_APP_API_URL+"transaction/", 
        {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }},
        {data:"placeholder"}
      )
      .then(({ data }) => {
        setUserAndTransactionData({
          userName: `${user.first_name} ${user.last_name}`,
          profile_picture:user.profile_picture,
          amount: `${value}€`
        })
        setStep(2)
      })
      .catch((error) => {
        setStep(-1)
        // SEND MONEY AND FAIL
        setError(error.response.data.code)
      });
    }
  }

  useEffect(() => getUser(id), [id])

  return <div>
    <VelocityTransitionGroup enter={{animation: (step === 2 || step === 0 || step === -1) ? "fadeIn" : "slideDown",duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
    { (step === -1) && <ErrorScreen error={error} tryAgain={handleTransaction} />}
    { (step === 0) && <Loading />}
  	{ (step === 1) && <SelectAmount operation="Send" userName={`${user.first_name} ${user.last_name}`} backStep={ null } setTransactionAmount={ handleTransaction }/>}
  	{ (step === 2) && <SuccessScreen operation="sent" data={userAndTransactionData}/>}
    </VelocityTransitionGroup>
  </div>
}