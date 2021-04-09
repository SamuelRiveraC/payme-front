import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Validation from '../components/Validation';
import LoadingScreen from '../components/Loading';
import {VelocityTransitionGroup} from "velocity-react"


export default function Register({ setToken }) {
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [first_name, setFirstName] = useState();
  const [last_name, setLastName] = useState();
  const [tos, setTos] = useState();
  const [alerts, setAlerts] = useState({}) //useState({duplicated:false,password:false,email:false,phone:false,first_name:false,last_name:false, tos:false})
  const [Loading, SetLoading]= useState(false)

  const turnOffValidation = () => {
    setTimeout( () => { setAlerts({duplicated:false,password:false,email:false,phone:false,first_name:false,last_name:false, tos:false}) }, 6250)
  }

  const handleSubmit = async e => {
    e.preventDefault();
    
    if (!password || !email || !phone || !first_name || !last_name || !tos) {
      setAlerts({password:!password?true:false,email:!email?true:false,phone:!phone?true:false,first_name:!first_name?true:false,last_name:!last_name?true:false,tos:!tos?true:false})
      turnOffValidation()
      return false;
    }
    
    SetLoading(true)

    axios.post(process.env.REACT_APP_API_URL+"users", { password, email, phone, first_name, last_name } )
    .then((response) => {
      setToken(response.data);
    })
    .catch((error) => {
      setAlerts( { duplicated:true })
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
            <Header back> Register in PayMe </Header>
            <div className="col-12 mobile_col">
              <Validation active={alerts.duplicated}> The Account email or phone number already exists  </Validation> <br/>
    
              <div className="form-outline ">
                <label className="form-label" >First name</label>
                <input type="text" className="form-control" onChange={e => setFirstName(e.target.value)} />
                <Validation active={alerts.first_name}> The first name is required  </Validation>
              </div>
              <div className="form-outline ">
                <label className="form-label" >Last name</label>
                <input type="text" className="form-control" onChange={e => setLastName(e.target.value)} />
                <Validation active={alerts.last_name}> The last name is required  </Validation>
              </div>
              <div className="form-outline ">
                <label className="form-label" >Email</label>
                <input type="email" className="form-control" onChange={e => setEmail(e.target.value)} />
                <Validation active={alerts.email}> The email is required  </Validation>
              </div>
              <div className="form-outline ">
                <label className="form-label" >Phone</label>
                <input type="phone" className="form-control" onChange={e => setPhone(e.target.value)} />
                <Validation active={alerts.phone}> The phone number is required  </Validation>
              </div>
              <div className="form-outline ">
                <label className="form-label" >Password</label>
                <input type="password" className="form-control" onChange={e => setPassword(e.target.value)} />
                <Validation active={alerts.password}> The password is required  </Validation>
              </div>
              <div className="form-check ">
                <input className="form-check-input" type="checkbox" onChange={e => setTos(e.target.checked)} />
                <label className="form-check-label" >
                  I Accept the Privacy policy and the Terms of Use
                </label>
                <br/>
                <Validation active={alerts.tos}> You are required to accept our ToS  </Validation>
              </div>
            </div>
            <div className="col-12 mobile_col">
              <button className="btn btn-primary w-100 " type="submit">Register</button>
            </div>
          </form>
        </div>}
    </VelocityTransitionGroup>
    </div>
  )
}

