import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from "react-router-dom"

import axios from 'axios';
import Loading from '../components/Loading';
import SearchUser from '../components/SearchUser';
import SelectAmount from '../components/SelectAmount';
import AuthorizeTransaction from '../components/AuthorizeTransaction';

import ErrorScreen from '../components/ErrorScreen';
import SuccessScreen from '../components/SuccessScreen';
import {VelocityTransitionGroup} from "velocity-react"

// TYPE: Send, Request, User, Payment

// http://localhost:3000/complete-payment/neonomics/?resource_id=4c60e471-d6f7-44b2-a33f-ba0fd25d974d&result=OK
// If bank is neonomics  c7443b8d-a834-47a6-b5c7-1de55af14257
// send resource_id

export default function TransactionCallback() {
  	let { bank } = useParams();
	const [step, setStep] = useState(null);	// Send, Request, User, Payment	
	const [error, setError] = useState("");
	const [userData, setuserData] = useState({ userName: "", amount: "", profile_picture: "" })
	const UserToken = JSON.parse(localStorage.getItem('user'))?.token

	const SetSuccessMessage = (data) => {
		setuserData({
			userName: `${data.first_name} ${data.last_name}`,
			profile_picture:data.profile_picture,
			amount: `${data.amount}€`,
		})
	}

	const useQuery = () => {
		return new URLSearchParams(useLocation().search);
	}
	let query = useQuery();
	const handleMethod = () => {
	    let code = query.get("resource_id")

		axios.post( process.env.REACT_APP_API_URL+"oauth-transactions-callback/", {
			bank: bank, code: code
		},
		{ headers: { Authorization: `Bearer ${UserToken}` } 
		}).then( (response) => {
			SetSuccessMessage(response.data)
			setStep(true)
		}).catch((error) => {
			setError(error.response.data.code ?? error.response.data.message)
			setStep(false);
		});
	}

  	useEffect(() => handleMethod(), [])


	return <div> 
		<VelocityTransitionGroup enter={{animation: (step === false || step === null || step === true) ? "fadeIn" : "slideDown",duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
			
			{ (step === false) && <ErrorScreen error={error} />}
			{ (step === null)  && <Loading />}
			{ (step === true)  && <SuccessScreen operation={"sent"} data={userData}/>}

		</VelocityTransitionGroup>
	</div>
}
