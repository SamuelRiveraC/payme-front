import React from 'react'
import { useHistory } from "react-router-dom"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

export default function BackButton() {
  let history = useHistory()
  function handleClick() {
    history.goBack() 
  }
  return (
    <button className="link" onClick={handleClick}>
		<FontAwesomeIcon size="lg" icon={faChevronLeft} />
    </button>
  );
}
