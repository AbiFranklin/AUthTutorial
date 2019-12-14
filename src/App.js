import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import NavBar from "./Nav";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";
import PrivateRoute from "./PrivateRoute"

class App extends Component {
  constructor(props) {
    super(props);
    this.auth = new Auth(this.props.history);
  }

  render() {
    return (
      <div>
        <NavBar auth={this.auth} />
        <div className="body">
          <PrivateRoute path="/" exact component={Home} auth={this.auth} />
          <PrivateRoute path="/profile" component={Profile} auth={this.auth} />
          <Route path="/public" component={Public} />
          <PrivateRoute path="/private" component={Private} auth={this.auth} />
          <PrivateRoute path="/courses" scopes={["read:courses"]} component={Courses} auth={this.auth} />
          <PrivateRoute path="/callback" component={Callback} auth={this.auth} />
        </div>
      </div>
    );
  }
}

export default App;
