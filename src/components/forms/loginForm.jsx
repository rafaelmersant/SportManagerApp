import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "../common/form";
import auth from "../../services/authService";
import { toast } from "react-toastify";

class LoginForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().required().label("Email / Usuario"),
    password: Joi.string().required().label("Contraseña"),
  };

  doSubmit = async () => {
    try {
      const { data: credentials } = this.state;
      await auth.login(credentials);

      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Email/Contraseña incorrecto.");

      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;

    return (
      <div className="container col-xl-4 col-lg-5 col-md-5 col-sm-8 shadow p-3 mb-5 bg-white rounded">
        <h2 className="bg-fenix-blue text-light pl-2 pr-2 pt-1 pb-1 border rounded">
          Entrar al Sistema
        </h2>
        <div className="col-12 pb-3 bg-light">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("email", "Email / Usuario")}
            {this.renderInput("password", "Contraseña", "password")}

            <div className="text-center">{this.renderButton("Entrar")}</div>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
