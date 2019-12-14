import React, { Component } from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./Profile";
import NavBar from "./Nav";
import Auth from "./Auth/Auth";
import Callback from "./Callback";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";
import PrivateRoute from "./PrivateRoute";
import AuthContext from "./AuthContext";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: new Auth(this.props.history)
    }
  }

  render() {
    const { auth } = this.state;
    return (
      <AuthContext.Provider value={auth}>
        <div>
          <NavBar auth={auth}/>
          <div className="body">
            <PrivateRoute path="/" exact component={Home} />
            <PrivateRoute path="/profile" component={Profile} />
            <Route path="/public" component={Public} />
            <PrivateRoute path="/private" component={Private} />
            <PrivateRoute path="/courses" scopes={["read:courses"]} component={Courses} />
            <PrivateRoute path="/callback" component={Callback} />
          </div>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;
