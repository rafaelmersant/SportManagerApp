import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import Form from "./common/form";
import {
  getParent,
  getParents,
  saveParent,
  deleteParent,
} from "../services/athleteService";
import { getCurrentUser } from "../services/authService";
import ParentsTable from "./tables/parentsTable";

class ParentInfo extends Form {
  state = {
    data: {
      id: 0,
      athlete_id: parseInt(this.props.match.params.id),
      name: "",
      phone_number: "",
      email: "",
      career: "",
      created_user: getCurrentUser().email,
      creation_date: new Date().toISOString(),
    },
    parents: [],
    errors: {},
  };

  schema = {
    id: Joi.number(),
    athlete_id: Joi.number(),
    name: Joi.string().required().max(150).label("Nombre"),
    phone_number: Joi.optional(),
    email: Joi.optional(),
    career: Joi.optional(),
    created_user: Joi.string(),
    creation_date: Joi.string(),
  };

  async populateParents() {
    try {
      const athleteId = this.props.match.params.id;
      if (athleteId === "new") return;

      const { data: parents } = await getParents(athleteId);
      this.setState({
        parents,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateParents();
  }

  mapToViewModel(parent) {
    return {
      id: parent[0].id,
      athlete_id: parent[0].athlete_id,
      name: parent[0].name,
      phone_number: parent[0].phone_number ? parent[0].phone_number : "",
      email: parent[0].email ? parent[0].email : "",
      career: parent[0].career ? parent[0].career : "",
      created_user: parent[0].created_user
        ? parent[0].created_user
        : getCurrentUser().email,
      creation_date: parent[0].creation_date,
    };
  }

  handleSort = () => {
    console.log("sorted");
  };

  handleDeleteParent = async (parent) => {
    const answer = window.confirm(
      `Seguro que desea eliminar a: ${parent.name}`
    );

    if (answer) {
      try {
        var deleted = await deleteParent(parent.id);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Este registro ya fue eliminado");
      }

      if (deleted && deleted.status === 200) {
        toast.success(`${parent.name} fue eliminado con exito!`);
        this.populateParents();
      }
    }
  };

  handleEditParent = async (parent) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    const { data: item } = await getParent(parent.id);

    if (item) {
      const data = {
        id: item[0].id,
        athlete_id: item[0].athlete.id,
        name: item[0].name,
        phone_number: item[0].phone_number,
        email: item[0].email,
        career: item[0].career,
        created_user: getCurrentUser().email,
        creation_date: new Date().toISOString(),
      };

      this.setState({ data });
    }
  };

  doSubmit = async () => {
    const { data } = { ...this.state };

    try {
      const { data: parent } = await saveParent(data);

      data.id = 0;
      data.name = "";
      data.phone_number = "";
      data.email = "";
      data.career = "";

      this.setState({ data });

      console.log(parent);
    } catch (ex) {
      console.log(ex);
    }

    await this.populateParents();
    toast.success("Agregado con exito!");
  };

  render() {
    const { parents } = { ...this.state };

    return (
      <React.Fragment>
        <div>
          <h4 className="text-fenix-yellow bg-fenix-blue pl-1 pr-1 pt-1 pb-1">
            Agregar un Relacionado
          </h4>

          <div className="col-12 pb-3 mb-3 bg-light">
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-12">
                  {this.renderInput("name", "Nombre")}
                </div>
                <div className="col-lg-3 col-md-3 col-sm-12">
                  {this.renderInput("career", "Profesión")}
                </div>
                <div className="col-lg-2 col-md-2 col-sm-12">
                  {this.renderInput("phone_number", "Teléfonos")}
                </div>
                <div className="col-lg-3 col-md-3 col-sm-12">
                  {this.renderInput("email", "Email")}
                </div>
              </div>

              <div className="text-left">{this.renderButton("Guardar")}</div>
            </form>
          </div>
        </div>

        <div>
          <div className="row">
            <div className="col">
              {parents.length > 0 && (
                <div style={{ minHeight: "330px" }}>
                  <ParentsTable
                    parents={parents}
                    sortColumn={{ path: "name", order: "asc" }}
                    onDelete={this.handleDeleteParent}
                    onEdit={this.handleEditParent}
                    onSort={this.handleSort}
                  />
                </div>
              )}

              {!parents.length > 0 && (
                <div
                  className="text-center mt-3"
                  style={{ paddingBottom: "8rem" }}
                >
                  <span
                    className="fa fa-users text-muted"
                    style={{ fontSize: "6em" }}
                  ></span>
                  <h2 className="text-secondary">
                    Aún no ha agregado relacionados
                  </h2>
                  <h4 className="text-secondary">Buen momento para iniciar</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ParentInfo;
