import React from 'react';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';
import Placeholder from "../img/Placeholder.png"

export default function SuccessScreen({operation, data, account}) {

  return(
    <div className="container container-transparent">
      
      { !account && <div className="row mobile_row">
        <div className="col-12 mobile_col text-center">
          <h1> {data.amount} {operation} to {data.userName}</h1>  
        </div>
        <div className="col-12 mobile_col text-center">
          <img src={Placeholder} alt="profile_picture" style={{height:160,borderRadius:"100%"}}/>
        </div>
        { data.id && <div className="col-12 mobile_col text-center" style={{cursor:"pointer"}} 
          onClick={() => {navigator.clipboard.writeText(`${process.env.REACT_APP_APP_URL}request/${data.id}`)}}>
          
          

          <p> Share with {data.userName} the link or QR code </p>
      
          <p> <b> {`${process.env.REACT_APP_APP_URL}request/${data.id}`} </b> </p>
      
          <QRCode value={`${process.env.REACT_APP_APP_URL}request/${data.id}`} />
      
        </div> }
        <div className="col-12 mobile_col text-center">
          <Link className="btn btn-light w-100 mb-3" to="/">
            Main Menu
          </Link>
        </div>
      </div>}
      { account && 
      <div className="row mobile_row">
        <div className="col-12 mobile_col text-center">
          <br />  
        </div>
        <div className="col-12 mobile_col text-center">
          <h1> {account}</h1>  
        </div>
        <div className="col-12 mobile_col text-center">
          <Link className="btn btn-light w-100 mb-3" to="/">
            Main Menu
          </Link>
        </div>
      </div>



      }


    </div>
  )
}

