import React, { useState } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import SearchUser from '../components/SearchUser';
import SelectAmount from '../components/SelectAmount';
import DBOTP from '../components/DB_otp';

import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"

export default function Send() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState(0);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [otp, setOTP] = useState("");
  
  let PrimaryBank = JSON.parse(localStorage.getItem('user')).user.bankAccounts.find(item => item.primary === "true")?.bank

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

      if (PrimaryBank === "deutschebank") {
        setStep(3)
      } else {
        setStep(0)
        axios.post( process.env.REACT_APP_API_URL+"transactions/", {
            user_receiver_id: user.id,
            amount: value,
            bank: PrimaryBank,
            otp: "",
          },
            {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }},
          ).then( (response) => {
            setUserAndTransactionData({
              userName: `${response.data.receiver.first_name} ${response.data.receiver.last_name}`,
              profile_picture:response.data.receiver.profile_picture,
              amount: `${response.data.amount}€`,
            })
            setStep(4)
          }).catch((error) => { setStep(-1); setError(error.response.data.code) });
      }
    
    } else if (step === 3) {
      setStep(0)
      axios.post( process.env.REACT_APP_API_URL+"transactions/", {
          user_receiver_id: user.id,
          amount: amount,
          bank: PrimaryBank,
          otp: value,
        },
        {headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.token}` }},
      )
      .then( (response) => {
        if (response.status === 200 || response.status === 201) {
          setUserAndTransactionData({
            userName: `${response.data.receiver.first_name} ${response.data.receiver.last_name}`,
            profile_picture:response.data.receiver.profile_picture,
            amount: `${response.data.amount}€`,
            // id: response.data.id
          })
          setStep(4)
        } else {
          setStep(-1)
          console.log("Error")
          setError("Error")
        }
      })
      .catch((error) => {
        setStep(-1)
        console.log(JSON.stringify(error.response.status))
        setError(JSON.stringify(error.response.status))
      });
  	}
  }




  return <div>
    <VelocityTransitionGroup enter={{animation: (step === 3 || step === 0 || step === -1) ? "fadeIn" : "slideDown",duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
    { (step === -1) && <ErrorScreen error={error} />}
    { (step === 0)  && <Loading />}
  	{ (step === 1)  && <SearchUser 	 operation="Send" setTransactionUser={ handleTransaction }/>}
  	{ (step === 2)  && <SelectAmount operation="Send" userName={`${user.first_name} ${user.last_name}`} backStep={ backStep } setTransactionAmount={ handleTransaction }/>}
    { (step === 3)  && <DBOTP iban={user.bankAccounts[0].iban} amount={amount} setOTP={handleTransaction} backStep={ backStep }/>}
  	{ (step === 4)  && <SuccessScreen operation="sent" data={userAndTransactionData}/>}
    </VelocityTransitionGroup>
  </div>
}
