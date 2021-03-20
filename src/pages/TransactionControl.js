import React, { useState, useEffect } from 'react';
import { useParams  } from 'react-router-dom';

import axios from 'axios';
import Loading from '../components/Loading';
import SearchUser from '../components/SearchUser';
import SelectAmount from '../components/SelectAmount';
import AuthorizeTransaction from '../components/AuthorizeTransaction';

import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"

// TYPE: Send, Request, User, Payment

export default function TransactionControl({transactionType}) {
  	let { transactionID, userSlug } = useParams();
	const [step, setStep] = useState(null);					// Send, Request, User, Payment	
	const [user, setUser] = useState(0); 					// FILLED AT TYPE: User, Payment
	const [amount, setAmount] = useState();					// FILLED AT TYPE: Payment

	const [OTPID, setOTPID] = useState();

	const [error, setError] = useState("");
	const [userData, setuserData] = useState({ userName: "", amount: "", profile_picture: "" })

	const UserToken = JSON.parse(localStorage.getItem('user'))?.token

	const backStep = () => {
		if (step>1)
	    setStep(step-1)
	}
	const tryAgain = () => {
		setStep(null)
		handleAuthorization(amount)
	}
	const SetSuccessMessage = (data) => {
		setuserData({
			userName: `${data.first_name} ${data.last_name}`,
			profile_picture:data.profile_picture,
			amount: `${data.amount}€`,
		})
	}

	const handleUser = (value) => {
		setUser(value)
		setStep(2)
	}
	const handleAmount = (value) => {
		setAmount( parseFloat(value) )
		handleAuthorization(parseFloat(value))
	}


	const handleAuthorization = (amountArgument) => {
		setStep(null)
		axios.post( process.env.REACT_APP_API_URL+"oauth-transactions/", {
			type: transactionType,
			transaction: transactionID&&transactionID, //if exists
			counterParty: userSlug?userSlug:user.id,
			amount: amountArgument
		},
		{ headers: { Authorization: `Bearer ${UserToken}` } 
		}).then( (response) => {
			if (response.data.bank === "payme") {
				SetSuccessMessage(response.data)
				setStep(true)
			} else if (response.data.bank === "deutschebank") { 
				setOTPID(response.data.id)



				setStep(3)
			} else if (response.data.bank === "rabobank") { 
		       	window.open(response.data.url, '_blank')
				SetSuccessMessage(response.data)
				setStep(true)

			} else if (response.data.bank === "neonomics") { 
		        window.location.href = response.data.url
			} else {
				SetSuccessMessage(response.data)
				setStep(true)
			}

		}).catch((error) => {
			setOTPID(undefined)
			setError(error.response.data.code ?? error.response.data.message)
			setStep(false);
		});	
    }  

	const handleAuthorizationCallBack = (bank,code) => {
		setStep(null)
		if (bank === "deutschebank") { 
			axios.post( process.env.REACT_APP_API_URL+"oauth-transactions/", {
				type: transactionType,
				transaction: transactionID&&transactionID, //if exists
				counterParty: userSlug?userSlug:user.id,
				amount: amount,
				otp_auth_id:OTPID,
				otp_auth_key: code
			},
			{ headers: { Authorization: `Bearer ${UserToken}` } 
			}).then( (response) => {
				if (response.data.bank === "deutschebank") { 
					setOTPID(undefined)
					SetSuccessMessage(response.data)
				} else if (response.data.bank === "rabobank") { 

				} else if (response.data.bank === "neonomics") { 

				}
				setStep(true)
			}).catch((error) => {
				setOTPID(undefined)
				setError(error.response.data.code ?? error.response.data.message)
				setStep(false);
			});
		} else if (bank === "rabobank") { 

		} else if (bank === "neonomics") { 

		}
	}

	const handleMethod = () => {
		switch (transactionType) {
			case "Send":
				setStep(1)
				break;
			case "Request":
				setStep(1)
				break;
			case "User":
				axios.get( process.env.REACT_APP_API_URL+"users/"+userSlug, {
					headers: { Authorization: `Bearer ${UserToken}` }
				}).then(({ data }) => {
   					setUser(data);
   					setStep(2)
   				}).catch((error) => {
   					setError(error.response.data.code)
   					setStep(false);
   				})
			break;
			case "Payment":
				handleAuthorization()
				break;
			default:
				setStep(1)
				break;
		}
	}



  	useEffect(() => handleMethod(transactionType), [])


	return <div> 
		<VelocityTransitionGroup enter={{animation: (step === false || step === null || step === true) ? "fadeIn" : "slideDown",duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
			
			{ (step === false) && <ErrorScreen error={error} tryAgain={tryAgain}/>}
			{ (step === null)  && <Loading />}
			{ (step === true)  && <SuccessScreen operation={transactionType==="Request"?"requested":"sent"} data={userData}/>}
	
			{ (step === 1)  && <SearchUser 	 operation={transactionType==="Request"?"Request":"Send"} setTransactionUser={ handleUser }/>}
			{ (step === 2)  && <SelectAmount operation={transactionType==="Request"?"Request":"Send"} setTransactionAmount={ handleAmount } 
								userName={`${user.first_name} ${user.last_name}`} backStep={ backStep } />}
			{ (step === 3)  && <AuthorizeTransaction handleAuthorization={handleAuthorizationCallBack} backStep={backStep} />}

		</VelocityTransitionGroup>
	</div>
}
