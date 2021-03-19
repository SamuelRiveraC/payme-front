import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faBackspace } from '@fortawesome/free-solid-svg-icons'

export default function SearchUsers( {userName,backStep,operation,setTransactionAmount} ) {
  const [amount, setAmount] = useState("");

  const calculator = (input) =>{

      if ( input === "X" || input === "x" || input === "" || input === "Backspace") {
        setAmount( amount.slice(0, -1) )
      } else if (input === ".") {
        if (!amount.includes(".") ) {
          setAmount(amount+".")
        } 
      } else if (input === "-") {
        if (!amount.includes("-") ) {
          setAmount(amount+"-")
        } 
      } else if (input !== " " && !isNaN(input)) {

        let checkString = amount.split(".")

        if (checkString.length !== 1 ) {
          if (checkString[1].length <= 1) {
            setAmount(amount + input)
          }
        } else {
          setAmount(amount + input)
        }
      }
  }

  const handleTransaction = () => {
    setTransactionAmount(amount)
  }


  return(
    <div className="container">
      <div className="row mobile_row">

        <div className="col-12 mobile_col">
          <div className="row">
            <div className="col-6">
              { backStep ? <button className="link" onClick={backStep}>
                <FontAwesomeIcon size="lg" icon={faChevronLeft} />
              </button> : <Link to="/">
                <FontAwesomeIcon size="lg" icon={faChevronLeft} />
              </Link>
              }
            </div>
            <div className="col-6 mt-5 mobile_col title d-flex justify-content-between">
              <span> Select Amount </span>
              <small> {userName} </small>
            </div>
          </div>
        </div>

        <div className="col-12 mobile_col calculator">
          <div className="form-outline mb-3">
            <input type="text" className="form-control" value = {amount} onKeyUp={e => calculator(e.key)} />
          </div>
        </div>

        <div className="col-12 mobile_col calculator">
          <div className="button" onClick={() => calculator("1") }>1</div>
          <div className="button" onClick={() => calculator("2") }>2</div>
          <div className="button" onClick={() => calculator("3") }>3</div>
          <div className="button" onClick={() => calculator("4") }>4</div>
          <div className="button" onClick={() => calculator("5") }>5</div>
          <div className="button" onClick={() => calculator("6") }>6</div>
          <div className="button" onClick={() => calculator("7") }>7</div>
          <div className="button" onClick={() => calculator("8") }>8</div>
          <div className="button" onClick={() => calculator("9") }>9</div>
          <div className="button" onClick={() => calculator(".") }>.</div>
          <div className="button" onClick={() => calculator("0") }>0</div>
          <div className="button" onClick={() => calculator("X") }><FontAwesomeIcon size="lg" icon={faBackspace} /></div>
        </div>

        <div className="col-12 mobile_col ">
          <button className="btn btn-primary w-100 mb-3" onClick={handleTransaction}>
            {operation} payment
          </button>
        </div>

      </div>
    </div>

  )
}

