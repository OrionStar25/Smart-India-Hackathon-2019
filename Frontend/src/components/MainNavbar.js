import React, { Component } from 'react';
import logo from '../imgs/logo.svg';
import '../App.css';

class MainNavbar extends Component {
  render() {
    return (
      <nav className="navbar main-nav">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand main" href="http://localhost:3000"><img src={logo} /></a>
          </div>
        </div>
      </nav>
    )
  }
}

export default MainNavbar;
