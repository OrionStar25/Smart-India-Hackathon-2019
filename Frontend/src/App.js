import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Link, Route, Redirect } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loaded: false,
    }
  }

  render() {
    return (
      <div className="App container-fluid">
        <Switch>
          <Route path="/" exact={true} component={Dashboard} />
          <Route path="/upload" exact={true} component={Upload} />
        </Switch>
      </div>
    );
  }
}

export default App;
