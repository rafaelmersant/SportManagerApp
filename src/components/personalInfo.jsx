import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { registerLocale } from "react-datepicker";
// import es from "date-fns/locale/es";
import Form from "./common/form";
import {
  getAthlete,
  saveAthlete,
  getAthleteByFirstLastName,
} from "../services/athleteService";
import { getCurrentUser } from "../services/authService";
import firebase from "firebase/app";
import "firebase/storage";

// registerLocale("es", es);

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
      photo_filename: "",
      birthday: "", //new Date().toJSON().substr(0, 10),
      enrollment_year: new Date().getFullYear(),
      enrollment_month: new Date().getMonth() + 1,
      medical_information: "",
      created_user: getCurrentUser().email,
      creation_date: new Date().toISOString(),
    },
    errors: {},
    action: "Nuevo Atleta",
    birthday: "",
    enrollmentYears: [],
    enrollmentMonths: [],
  };

  schema = {
    id: Joi.number(),
    first_name: Joi.string().required().max(100).label("Nombre"),
    last_name: Joi.string().required().max(100).label("Apellidos"),
    email: Joi.optional(),
    address: Joi.optional(),
    phone_number: Joi.optional(),
    photo: Joi.optional(),
    photo_filename: Joi.optional(),
    birthday: Joi.string(),
    enrollment_year: Joi.optional(),
    enrollment_month: Joi.optional(),
    medical_information: Joi.optional(),
    created_user: Joi.string(),
    creation_date: Joi.string(),
  };

  async populateAthlete() {
    try {
      const athleteId = this.props.match.params.id;
      if (athleteId === "new") return;

      const { data: athlete } = await getAthlete(athleteId);
      const mappedAthlete = this.mapToViewModel(athlete);

      this.setState({
        data: mappedAthlete,
        action: "Editar Atleta",
        birthday: new Date(athlete[0].birthday.split("-").join("/")),
      });

      this.props.onChangePhoto({
        url: athlete[0].photo,
        filename: athlete[0].photo_filename,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  populateEnrollmentYears() {
    const initYear = 2000;
    let currentYear = new Date().getFullYear();
    let years = [];

    while (currentYear >= initYear) {
      years.push({ id: currentYear, name: currentYear });
      currentYear -= 1;
    }

    this.setState({ enrollmentYears: years });
  }

  populateEnrollmentMonths() {
    const enrollmentMonths = [];
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    months.forEach((month, index) => {
      enrollmentMonths.push({ id: index + 1, name: month });
    });

    this.setState({ enrollmentMonths });
  }

  async componentDidMount() {
    this.populateEnrollmentYears();
    this.populateEnrollmentMonths();

    await this.populateAthlete();

    if (this.props.athleteName && this.props.athleteName.length) {
      const data = { ...this.state.data };
      data.first_name = this.props.athleteName;
      this.setState({ data });
      this.forceUpdate();
    }
  }

  handleChangeBirthday = (date) => {
    const data = { ...this.state.data };
    data.birthday = date.toJSON().substr(0, 10);
    this.setState({ data, birthday: date });
  };

  mapToViewModel(athlete) {
    return {
      id: athlete[0].id,
      first_name: athlete[0].first_name,
      last_name: athlete[0].last_name,
      email: athlete[0].email ? athlete[0].email : "",
      address: athlete[0].address ? athlete[0].address : "",
      phone_number: athlete[0].phone_number ? athlete[0].phone_number : "",
      photo: athlete[0].photo ? athlete[0].photo : "",
      photo_filename: athlete[0].photo_filename
        ? athlete[0].photo_filename
        : "",
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
      creation_date: athlete[0].creation_date,
    };
  }

  doSubmit = async () => {
    const { data: _athlete } = await getAthleteByFirstLastName(
      this.state.data.first_name,
      this.state.data.last_name
    );

    if (_athlete.length > 0 && this.state.data.id === 0) {
      toast.error("Este atleta ya existe!");
      return false;
    }

    const { data } = { ...this.state };
    data.birthday = data.birthday
      ? new Date(this.state.birthday).toJSON().substr(0, 10)
      : "";

    data.photo = data.id === 0 ? "" : data.photo;

    if (sessionStorage["newPhoto"]) {
      var { photo_filename: old_photo } = { ...this.state.data };

      data.photo = sessionStorage["newPhoto"];
      data.photo_filename = sessionStorage["newPhoto_filename"];
    }

    console.log("Athlete: Before:", data);

    const { data: athlete } = await saveAthlete(data);
    console.log("Athlete: After:", athlete);

    //Remove old photo from firebase
    if (old_photo)
      firebase
        .storage()
        .ref("photos")
        .child(old_photo)
        .delete()
        .then(() => {
          console.log(`file ${old_photo} deleted`);
        })
        .catch((error) => {
          console.log(error);
        });

    sessionStorage["newPhoto"] = "";
    sessionStorage["newPhoto_filename"] = "";

    //window.location = `/athlete/${athlete.id}`;
    //this.props.history.push(`/athlete/${athlete.id}`);
  };

  render() {
    return (
      <React.Fragment>
        <h4 className="text-fenix-yellow bg-fenix-blue pl-1 pr-1 pt-1 pb-1">
          {this.state.action}
        </h4>

        <div className="col-12 pb-5 bg-light">
          <form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                {this.renderInput("first_name", "Nombre")}
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                {this.renderInput("last_name", "Apellidos")}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                {this.renderInput("email", "Email")}
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                {this.renderInput("phone_number", "Teléfono")}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-3 col-sm-12">
                {this.renderSelect(
                  "enrollment_year",
                  "Año de Inscripción",
                  this.state.enrollmentYears
                )}
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12">
                {this.renderSelect(
                  "enrollment_month",
                  "Mes de Inscripción",
                  this.state.enrollmentMonths
                )}
              </div>
              <div className="col-6">
                <label className="d-block">Fecha de Nacimiento</label>
                <DatePicker
                  selected={this.state.birthday}
                  onChange={(date) => this.handleChangeBirthday(date)}
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>

            {this.renderInput("address", "Dirección", "text", "", "Opcional")}
            {this.renderInput("medical_information", "Información médica")}

            <div className="text-center mt-2">
              {this.renderButton("Guardar")}
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default PersonalInfo;
