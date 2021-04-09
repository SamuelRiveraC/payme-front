import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Validation from '../components/Validation';
import LoadingScreen from '../components/Loading';

import {VelocityTransitionGroup} from "velocity-react"


export default function Login({ setToken }) {
  const [emailOrPhone, setUserName] = useState();
  const [password, setPassword] = useState();
  const [alerts, setAlerts] = useState({wrong:false,emailOrPhone:false,password:false})
  const [Loading, SetLoading]= useState(false)


  const turnOffValidation = () => {
    setTimeout( () => { setAlerts({wrong:false,emailOrPhone:false,password:false}) }, 6250)
  }

  const handleSubmit = async e => {
    e.preventDefault();

    if (!emailOrPhone || !password) {
      setAlerts({wrong:false,emailOrPhone:!emailOrPhone?true:false,password:!password?true:false})
      turnOffValidation()
      return false;
    }

    SetLoading(true)
    
    axios.post(process.env.REACT_APP_API_URL+"login", { emailOrPhone, password } )
    .then((response) => {
      setToken(response.data);
    })
    .catch((error) => {
      setAlerts( { wrong:true, emailOrPhone:false, password:false })
      turnOffValidation()
      SetLoading(false)
    });

  }

  return(
    <div>
    <VelocityTransitionGroup enter={{animation: "slideDown", duration:500,delay:600}} leave={{animation: "slideUp",duration:500}} >
      {Loading ? <LoadingScreen /> :
        <div className="container">
          <form className="row mobile_row" onSubmit={handleSubmit}>
    
            <Header back> Log in PayMe </Header>
    
            <div className="col-12 mobile_col">
              <Validation active={alerts.wrong}> The Email, phone or password are incorrect  </Validation> <br/>
                
    
              <div className="form-outline">
                <label className="form-label" >Email or Phone</label>
                <input type="text" className="form-control" onChange={e => setUserName(e.target.value)} />
                <Validation active={alerts.emailOrPhone}> A phone number or email is required </Validation>
              </div>
              <div className="form-outline">
                <label className="form-label" >Password</label>
                <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} />
                <Validation active={alerts.password}> The password is required </Validation>
              </div>
              <div className="form-outline">
                <a className="w-100 py-3" href="#">I Forgot my Password</a>
              </div>
            </div>
    
            <div className="col-12 mobile_col text-center">
              <button className="btn btn-primary w-100 mb-3" type="submit">Log In</button>
            </div>
          </form>
        </div>}
    </VelocityTransitionGroup>
    </div>
  )
}

