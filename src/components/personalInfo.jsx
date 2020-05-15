import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import Form from "./common/form";
import {
  getAthlete,
  saveAthlete,
  getAthleteByFirstLastName,
} from "../services/athleteService";
import { getCurrentUser } from "../services/authService";
import firebase from "firebase/app";
import "firebase/storage";
import Select from "./common/select";

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
      enrollment_year: "0", //new Date().getFullYear(),
      enrollment_month: "0", //new Date().getMonth() + 1,
      medical_information: "",
      category: "0",
      created_user: getCurrentUser().email,
      creation_date: new Date().toISOString(),
    },
    errors: {},
    action: "Nuevo Atleta",
    birthdateDays: [],
    birthdateMonths: [],
    birthdateYears: [],
    enrollmentYears: [],
    enrollmentMonths: [],
    birthdateData: { day: "0", month: "0", year: "0" },
    months: [
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
    ],
    categories: [
      { id: "0", name: "Seleccionar..." },
      { id: "Normal", name: "Normal" },
      { id: "Master", name: "Master" },
    ],
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
    birthday: Joi.optional(),
    enrollment_year: Joi.optional(),
    enrollment_month: Joi.optional(),
    medical_information: Joi.optional(),
    category: Joi.optional(),
    created_user: Joi.string(),
    creation_date: Joi.string(),
  };

  async populateAthlete() {
    try {
      const athleteId = this.props.match.params.id;
      if (athleteId === "new") return;

      const { data: athlete } = await getAthlete(athleteId);
      const mappedAthlete = this.mapToViewModel(athlete.results);

      if (athlete.results[0].birthday)
        this.mapToBirthdate(mappedAthlete.birthday);

      this.setState({
        data: mappedAthlete,
        action: "Editar Atleta",
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

    years.push({ id: "0", name: "Seleccionar..." });

    while (currentYear >= initYear) {
      years.push({ id: currentYear, name: currentYear });
      currentYear -= 1;
    }

    this.setState({ enrollmentYears: years });
  }

  populateEnrollmentMonths() {
    const enrollmentMonths = [];

    enrollmentMonths.push({ id: "0", name: "Seleccionar..." });

    this.state.months.forEach((month, index) => {
      enrollmentMonths.push({ id: index + 1, name: month });
    });

    this.setState({ enrollmentMonths });
  }

  populateBirthdateDays() {
    let days = [];
    days.push({ id: 0, name: "Día" });

    for (let i = 1; i <= 31; i++) {
      const _day = i.toString().padStart(2, "0");
      days.push({ id: _day, name: _day });
    }

    this.setState({ birthdateDays: days });
  }

  populateBirthdateMonths() {
    let months = [];
    months.push({ id: 0, name: "Mes" });

    for (let i = 1; i <= 12; i++) {
      const _month = i.toString().padStart(2, "0");
      months.push({ id: _month, name: this.state.months[i - 1] });
    }
    this.setState({ birthdateMonths: months });
  }

  populateBirthdateYears() {
    let years = [];
    years.push({ id: 0, name: "Año" });

    let startYear = new Date().getFullYear() - 5;
    let endYear = new Date().getFullYear() - 40;

    for (let i = startYear; i >= endYear; i--) {
      years.push({ id: i, name: i });
    }
    this.setState({ birthdateYears: years });
  }

  validateBirthdate = async () => {
    const { birthdateData, data } = { ...this.state };
    let birthdate = this.state.data.birthday;

    if (
      birthdateData.day !== "0" &&
      birthdateData.month !== "0" &&
      birthdateData.year !== "0"
    ) {
      birthdate = [
        birthdateData.year,
        birthdateData.month,
        birthdateData.day,
      ].join("-");
    }

    if (birthdate) {
      const date = new Date(birthdate);

      if (date instanceof Date && isFinite(date)) {
        data.birthday = birthdate;
        this.setState({ data });

        return true;
      }
    }

    if (
      !birthdate &&
      birthdateData.year === "0" &&
      birthdateData.month === "0" &&
      birthdateData.day === "0"
    )
      return true;

    return false;
  };

  async componentDidMount() {
    this.populateEnrollmentYears();
    this.populateEnrollmentMonths();

    this.populateBirthdateDays();
    this.populateBirthdateMonths();
    this.populateBirthdateYears();

    await this.populateAthlete();

    // if (this.props.athleteName && this.props.athleteName.length) {
    //   const data = { ...this.state.data };
    //   data.first_name = this.props.athleteName;
    //   this.setState({ data });
    //   this.forceUpdate();
    // }
  }

  // handleChangeBirthday = (date) => {
  //   const data = { ...this.state.data };
  //   data.birthday = date.toJSON().substr(0, 10);
  //   this.setState({ data, birthday: date });
  // };

  mapToBirthdate(birthdate) {
    const date = new Date(birthdate);

    if (date instanceof Date && isFinite(date)) {
      const d = date.toJSON().substr(0, 10);

      const day = d.substr(8, 2);
      const month = d.substr(5, 2);
      const year = d.substr(0, 4);

      this.setState({ birthdateData: { day, month, year } });
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
      photo_filename: athlete[0].photo_filename
        ? athlete[0].photo_filename
        : "",
      birthday: athlete[0].birthday ? athlete[0].birthday : "",
      enrollment_year: athlete[0].enrollment_year
        ? athlete[0].enrollment_year
        : "0",
      enrollment_month: athlete[0].enrollment_month
        ? athlete[0].enrollment_month
        : "0",
      medical_information: athlete[0].medical_information
        ? athlete[0].medical_information
        : "",
      category: athlete[0].category ? athlete[0].category : "0",
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

    const validDate = await this.validateBirthdate();

    if (!validDate) {
      toast.error("La fecha de nacimiento no es valida.");
      return false;
    } else {
      if (data.birthday === "") delete data.birthday;
    }

    data.photo = data.id === 0 ? "" : data.photo;

    if (sessionStorage["newPhoto"]) {
      var { photo_filename: old_photo } = { ...this.state.data };

      data.photo = sessionStorage["newPhoto"];
      data.photo_filename = sessionStorage["newPhoto_filename"];
    }
    console.log("data", data);
    const { data: athlete } = await saveAthlete(data);

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

    toast.success("Los cambios fueron guardados!");

    if (this.props.match.params.id === "new")
      window.location = `/athlete/${athlete.id}`;
  };

  handleChangeBirthdate = ({ currentTarget: input }) => {
    const { birthdateData } = { ...this.state };

    birthdateData[input.name] = input.value;
    this.setState({ birthdateData });
  };

  render() {
    const disabled = getCurrentUser().role === "Level2" ? "disabled" : "";

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
              <div className="col-lg-6 col-md-6 col-sm-12">
                <label>Fecha de Nacimiento</label>
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-sm-4">
                    <Select
                      name="day"
                      value={this.state.birthdateData.day}
                      options={this.state.birthdateDays}
                      onChange={this.handleChangeBirthdate}
                      label=""
                      error={null}
                    />
                  </div>
                  <div className="col-lg-5 col-md-5 col-sm-4">
                    <Select
                      name="month"
                      value={this.state.birthdateData.month}
                      options={this.state.birthdateMonths}
                      onChange={this.handleChangeBirthdate}
                      error={null}
                    />
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <Select
                      name="year"
                      value={this.state.birthdateData.year}
                      options={this.state.birthdateYears}
                      onChange={this.handleChangeBirthdate}
                      error={null}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* {this.renderInput("address", "Dirección", "text", "", "Opcional")} */}
            {this.renderInput("medical_information", "Información médica")}
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                {this.renderSelect(
                  "category",
                  "Categoria",
                  this.state.categories,
                  disabled
                )}
              </div>
            </div>
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
