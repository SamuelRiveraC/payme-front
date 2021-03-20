import React from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import '../slick.css';

import logo from "../img/PayME_logo.png"
import logoUnicorn from "../img/payme-light.png"
import Money_transfer_1 from "../img/Money_transfer_1.png"
import Money_transfer_2 from "../img/Money_transfer_2.png"

function Onboarding() {
  const settings = {
    dots: true,
    arrows:false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return <div className="container container-transparent">

    <div className="row mobile_row">

      <div className="col-12 mobile_col onboarding">

        <Slider {...settings}>
          <div>
            <img src={logoUnicorn} alt="Logo" height="64" className="mb-0"/>
            <img src={logo} alt="Logo" />
            <br/>
            <h3>Easy payments for individuals and business</h3>
          </div>
          <div>
            <h1>Send money to family and friends</h1>
            <br/>
            <img src={Money_transfer_1} alt="Logo" />
          </div>
          <div>
            <h1>Pay products and service</h1>
            <br/>
            <img src={Money_transfer_2} alt="Logo" />
          </div>
        </Slider>
          
      </div>


  


      <div className="col-12 mobile_col text-center">
        <Link className="btn btn-light w-100 mb-3" to="/register">
          Register
        </Link>
        <br />
        <Link className="btn btn-link-dark w-100" to="/login">
          Log In
        </Link>
      </div>
    </div>

  </div>
}

export default Onboarding;
