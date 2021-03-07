import React from 'react';
import BackButton from '../components/BackButton';
import Validation from '../components/Validation';
import AutosuggestInput from '../components/AutosuggestInput';

export default function SearchUsers({operation,setTransactionUser}) {
  return(
    <div className="container">
      <div className="row mobile_row">

        <div className="col-12 mobile_col">
          <div className="row">
            <div className="col-6">
              <BackButton /> 
            </div>
            <div className="col-12 mt-5 mobile_col title d-flex justify-content-between">
              {operation} Payment
            </div>
          </div>
        </div>


        <div className="col-12 mobile_col">
          <div className="form-outline mb-3">
            <label className="form-label" > Search User by Email or Phone number </label>
            <AutosuggestInput setUser={ setTransactionUser }  />
          </div>
        </div>

        <div className="col-12 mobile_col">
          <br/>
        </div>


      </div>
    </div>

  )
}

