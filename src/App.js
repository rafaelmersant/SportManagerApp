import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./components/home";
import Athletes from "./components/athletes";
import AthleteForm from "./components/forms/athleteForm";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import LoginForm from "./components/forms/loginForm";
import Logout from "./components/logout";
import Users from "./components/users";
import UserForm from "./components/forms/userForm";
import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/authService";
import Document from "./components/document";
import Birthdates from "./components/birthdates";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import firebaseConfig from "./firebaseConfig";
import firebase from "firebase/app";

firebase.initializeApp(firebaseConfig);

class App extends Component {
  state = {
    user: {},
  };

  componentDidMount() {
    try {
      const user = auth.getCurrentUser();

      this.setState({ user });
    } catch (ex) {
      if (window.location.pathname !== "/login")
        window.location.replace("/login");
    }
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={this.state.user} />
        <main>
          <Switch>
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            {/* <Route path="/invoicePrint/:id" component={PrintInvoice} /> */}

            <ProtectedRoute path="/athletes" component={Athletes} />
            <ProtectedRoute path="/athlete/:id" component={AthleteForm} />
            <ProtectedRoute path="/users" component={Users} />
            <ProtectedRoute path="/user/:id" component={UserForm} />
            <ProtectedRoute path="/frances" component={Document} />
            <ProtectedRoute path="/birthdates" component={Birthdates} />
            <Route exact path="/" component={Home} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
