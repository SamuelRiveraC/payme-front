import React from 'react';
import axios from 'axios';
import {VelocityTransitionGroup} from "velocity-react"

export default class AutosuggestInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: this.props.value,
      results: []
    }
  }

  getInfo = async e => {
    axios.get(process.env.REACT_APP_API_URL+"users/search/"+this.state.query)
    .then(({ data }) => {
      this.setState({ results: data })
    })
  }

  selectUser = (user) => {
    this.setState({ results:[] }) // query:selected

    this.props.setUser(user) // THE CONTINUE BUTTON 
  }

  handleInputChange = () => {
    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 3) { 
        if (this.state.query.length % 2 === 0) {
          this.getInfo()
        }
      } else if (!this.state.query) { }
    })
  }

  render() {
    return (
      <div className="AutosuggestInput__container">
        <input
          className="form-control"
          placeholder="Email or Phone number"
          ref={input => this.search = input}
          onChange={() => this.handleInputChange() }
        />

        <ul className="AutosuggestInput">
        
        <VelocityTransitionGroup enter={{animation: "slideDown",duration:250,delay:300}} leave={{animation: "slideUp",duration:250}} >

          { this.state.results.map(r => (
            <li key={r.id} onClick={() => this.selectUser(r)}>
              <b>{r.first_name} {r.last_name}</b> <br/> {r.email}
            </li>
          ))}

        </VelocityTransitionGroup>

        </ul>

      </div>
    )
  }
}