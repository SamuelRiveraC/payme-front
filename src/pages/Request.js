import React, { useState } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import SearchUser from '../components/SearchUser';
import SelectAmount from '../components/SelectAmount';
import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"

export default function Request() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(0);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(0);

  const [userAndTransactionData, setUserAndTransactionData] = useState({ userName: "", amount: "", profile_picture: "" })

  const backStep = () => {
    if (step>1)
      setStep(step-1)
  }
  const handleTransaction = (value) => {
  	if (step === 1) {
      setUser(value)
      setStep(2)
    } else if (step === 2) {
      if (value <= 0 ) {
        return false
      }
      value = parseFloat(value)
      setAmount(value)
      setStep(0)

      axios.post( process.env.REACT_APP_API_URL+"transactions/", {
          user_sender_id: user.id,
          amount: value
        },
        {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }},
      )
      .then( (response) => {
        setUserAndTransactionData({
          userName: `${response.data.sender.first_name} ${response.data.sender.last_name}`,
          profile_picture:response.data.sender.profile_picture,
          amount: `${response.data.amount}€`,
          id: response.data.id
        })
        setStep(3)
      })
      .catch((error) => {
        setStep(-1)
        // SEND MONEY AND FAIL
        setError(error.response.data.code)
      });
    }
  }

  return <div>
    <VelocityTransitionGroup enter={{animation: (step === 3 || step === 0 || step === -1) ? "fadeIn" : "slideDown",duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
    { (step === -1) && <ErrorScreen error={error} />}
    { (step === 0)  && <Loading />}
  	{ (step === 1)  && <SearchUser 	 operation="Request" setTransactionUser={ handleTransaction }/>}
  	{ (step === 2)  && <SelectAmount operation="Request" userName={`${user.first_name} ${user.last_name}`} backStep={ backStep } setTransactionAmount={ handleTransaction }/>}
  	{ (step === 3)  && <SuccessScreen operation="requested "data={userAndTransactionData}/>}
    </VelocityTransitionGroup>
  </div>
}