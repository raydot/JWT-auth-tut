// A higher order component taken in a component and returns an enhanced component.
// Which makes a HOC just perfect for authentication.

import React, { Component } from 'react'
import AuthService from './AuthService'

export default function withAuth(AuthComponent) {
  // Instantiate AuthService
  const Auth = new AuthService('http://localhost:8080')

  // Return a class AuthWrapped in which Auth is handled
    return class AuthWrapped extends Component {
      constructor() {
        super()
        this.state = {
          user: null
        }
      } // constructor

      componentWillMount() {
        if (!Auth.loggedIn()) {
          this.props.history.replace('/login')
        } else {
          try {
            const profile = Auth.getProfile()
            this.setState({
              user: profile
            })
          }// try
          catch(err) {
            Auth.logout()
            this.props.history.replace('/login')
          }// catch
        } // if
      } // componentWillMount

      render() {
        if (this.state.user) {
          return (
            <AuthComponent history={this.props.history} user={this.state.user} />
          )
        } else {
          return null
        }
      }// render

    } // return class
} // export default


