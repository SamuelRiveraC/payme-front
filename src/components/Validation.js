import React from 'react';
import {VelocityTransitionGroup} from "velocity-react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'


export default class Validation extends React.Component {
  render() {
    return (
      <VelocityTransitionGroup enter={{animation: "fadeIn",duration:250,delay:250}} leave={{animation: "fadeOut",duration:250}} >
      	<div className="validation__error">
      		{this.props.active &&  <div> <FontAwesomeIcon size="lg" icon={faExclamationCircle} /> {this.props.children} </div>  }
		</div>
	  </VelocityTransitionGroup>
    )
  }
}