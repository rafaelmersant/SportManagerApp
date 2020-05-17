import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import {
  saveUser,
  getEmailExists,
  getUserInfo,
} from "../../services/userService";
import { getCurrentUser } from "../../services/authService";
import { toast } from "react-toastify";

class UserForm extends Form {
  state = {
    data: {
      id: 0,
      email: "",
      password: "",
      name: "",
      user_role: "",
      user_hash: "hash",
      athlete_id: 0,
      created_user: getCurrentUser().email,
      creation_date: new Date().toISOString(),
    },
    roles: [
      { id: "Admin", name: "Admin" },
      { id: "Level1", name: "Level1" },
      { id: "Level2", name: "Level2" },
      { id: "Reportes", name: "Reportes" },
    ],
    errors: {},
    action: "Nuevo Usuario",
    disabled: "",
  };

  schema = {
    id: Joi.number(),
    email: Joi.string().required().label("Email / Usuario"),
    password: Joi.string().required().min(4).max(30).label("Contraseña"),
    name: Joi.string().required().min(5).label("Nombre"),
    user_role: Joi.string().required().label("Rol"),
    user_hash: Joi.string().optional(),
    athlete_id: Joi.optional(),
    created_user: Joi.string(),
    creation_date: Joi.string(),
  };

  async populateUser() {
    try {
      const userId = this.props.match.params.id;
      if (userId === "new") return;

      const { data: user } = await getUserInfo(userId);

      this.setState({
        data: this.mapToViewModel(user),
        action: "Editar Usuario",
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateUser();

    this.limitedUser();
  }

  limitedUser() {
    let disabled = "";
    let action = this.state.action;
    const role = getCurrentUser().role;

    if (role === "Level2") {
      disabled = "disabled";
      action = "Cambiar Contraseña";
    }

    this.setState({ disabled, action });
  }

  mapToViewModel(user) {
    return {
      id: user.id,
      email: user.email,
      password: user.password ? user.password : "",
      name: user.name,
      user_role: user.user_role,
      user_hash: user.user_hash ? user.user_hash : "hash",
      athlete_id: user.athlete_id ? user.athlete_id : 0,
      created_user: user.created_user
        ? user.created_user
        : getCurrentUser().email,
      creation_date: user.creation_date,
    };
  }

  doSubmit = async () => {
    const { data: email } = await getEmailExists(
      this.state.data.company_id,
      this.state.data.email
    );

    if (email.length && this.state.data.id === 0) {
      toast.error("Este email ya existe en el sistema.");
      return false;
    }

    console.log(this.state.data);
    await saveUser(this.state.data);

    if (this.state.disabled === "") this.props.history.push("/users");
    else toast.success("La contraseña fue cambiada");
  };

  render() {
    let classes = "";
    if (this.state.disabled === "")
      classes = "container col-5 ml-3 shadow p-3 mb-5 bg-white rounded";
    else
      classes =
        "container col-lg-4 col-md-6 col-sm-11 shadow p-3 mb-5 bg-white rounded";

    return (
      <div className={classes}>
        <h2 className="bg-fenix-blue text-fenix-yellow pl-2 pr-2 pt-1 pb-1">
          {this.state.action}
        </h2>
        <div className="col-12 pb-3 bg-light">
          <form onSubmit={this.handleSubmit}>
            {this.renderInput(
              "email",
              "Email / Usuario",
              "text",
              this.state.disabled
            )}
            {this.renderInput("password", "Contraseña", "password")}
            {this.renderInput("name", "Nombre", "text", this.state.disabled)}
            {this.state.disabled !== "disabled" && (
              <span>
                {this.renderSelect("user_role", "Rol", this.state.roles)}
                {this.renderInput(
                  "athlete_id",
                  "Atleta Id",
                  "text",
                  this.state.disabled
                )}
              </span>
            )}
            {this.renderButton("Guardar")}
          </form>
        </div>
      </div>
    );
  }
}

export default UserForm;
