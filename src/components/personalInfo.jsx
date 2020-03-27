import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import Form from "./common/form";
import {
  getAthlete,
  saveAthlete,
  getAthleteByFirstLastName
} from "../services/athleteService";
import { getCurrentUser } from "../services/authService";

class PersonalInfo extends Form {
  state = {
    data: {
      id: 0,
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      phone_number: "",
      photo: "",
      birthday: new Date().toJSON().substr(0, 10),
      enrollment_year: "",
      enrollment_month: "",
      medical_information: "",
      created_user: getCurrentUser().email,
      creation_date: new Date().toISOString()
    },
    errors: {},
    action: "Nuevo Atleta"
  };

  schema = {
    id: Joi.number(),
    first_name: Joi.string()
      .required()
      .max(100)
      .label("Nombre"),
    last_name: Joi.string()
      .required()
      .max(100)
      .label("Apellidos"),
    email: Joi.optional(),
    address: Joi.optional(),
    phone_number: Joi.optional(),
    photo: Joi.optional(),
    birthday: Joi.optional(),
    enrollment_year: Joi.optional(),
    enrollment_month: Joi.optional(),
    medical_information: Joi.optional(),
    created_user: Joi.string(),
    creation_date: Joi.string()
  };

  async populateAthlete() {
    try {
      const athleteId = this.props.match.params.id;
      if (athleteId === "new") return;

      const { data: athlete } = await getAthlete(athleteId);

      this.setState({
        data: this.mapToViewModel(athlete),
        action: "Editar Atleta"
      });

      this.props.onChangePhoto(athlete[0].photo);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateAthlete();

    if (this.props.athleteName && this.props.athleteName.length) {
      const data = { ...this.state.data };
      data.first_name = this.props.athleteName;
      this.setState({ data });
      this.forceUpdate();
    }
  }

  mapToViewModel(athlete) {
    return {
      id: athlete[0].id,
      first_name: athlete[0].first_name,
      last_name: athlete[0].last_name,
      email: athlete[0].email ? athlete[0].email : "",
      address: athlete[0].address ? athlete[0].address : "",
      phone_number: athlete[0].phone_number ? athlete[0].phone_number : "",
      photo: athlete[0].photo ? athlete[0].photo : "",
      birthday: athlete[0].birthday ? athlete[0].birthday : "",
      enrollment_year: athlete[0].enrollment_year
        ? athlete[0].enrollment_year
        : "",
      enrollment_month: athlete[0].enrollment_month
        ? athlete[0].enrollment_month
        : "",
      medical_information: athlete[0].medical_information
        ? athlete[0].medical_information
        : "",
      created_user: athlete[0].created_user
        ? athlete[0].created_user
        : getCurrentUser().email,
      creation_date: athlete[0].creation_date
    };
  }

  doSubmit = async () => {
    const { data: _athlete } = await getAthleteByFirstLastName(
      this.state.data.first_name.toUpperCase(),
      this.state.data.last_name.toUpperCase()
    );

    if (_athlete.length > 0 && this.state.data.id === 0) {
      toast.error("Este atleta ya existe!");
      return false;
    }

    const { data } = { ...this.state };
    data.first_name = data.first_name.toUpperCase();
    data.last_name = data.last_name.toUpperCase();

    const { data: athlete } = await saveAthlete(data);
    console.log(athlete);

    this.props.history.push("/athletes");
  };

  render() {
    return (
      <React.Fragment>
        <h4 className="text-fenix-yellow bg-fenix-blue pl-1 pr-1 pt-1 pb-1">
          {this.state.action}
        </h4>

        <div className="col-12 pb-3 mb-3 bg-light">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col d-md-block d-sm-none">
                {this.renderInput("first_name", "Nombre")}
              </div>
              <div className="col">
                {this.renderInput("last_name", "Apellidos")}
              </div>
            </div>
            <div className="row">
              <div className="col">{this.renderInput("email", "Email")}</div>
              <div className="col">
                {this.renderInput("phone_number", "Teléfono")}
              </div>
            </div>
            <div className="row">
              <div className="col">
                {this.renderInput("enrollment_year", "Año de Inscripción")}
              </div>
              <div className="col">
                {this.renderInput("enrollment_month", "Mes de Inscripción")}
              </div>
            </div>

            {this.renderInput("birthday", "Fecha de Nacimiento")}
            {this.renderInput("address", "Dirección")}
            {this.renderInput("medical_information", "Información médica")}
            {this.renderInput("photo", "Foto")}

            <div className="text-center">{this.renderButton("Guardar")}</div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default PersonalInfo;
