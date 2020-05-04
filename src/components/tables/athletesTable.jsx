import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/table";
import { defaultPhoto } from "../../variables";
import auth from "../../services/authService";

class AthletesTable extends Component {
  columns = [
    {
      path: "photo",
      label: "Foto",
      content: (athlete) => (
        // <Link to={`/athlete/${athlete.id}`}>
        <a href={`/athlete/${athlete.id}`}>
          <div className="text-center">
            <div
              className="border rounded-circle d-inline-block"
              style={{
                width: "75px",
                height: "75px",
                backgroundImage:
                  "url(" + (athlete.photo ? athlete.photo : defaultPhoto) + ")",
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        </a>
        // </Link>
      ),
    },
    {
      path: "first_name",
      label: "Nombre",
      classes: "align-middle",
      content: (athlete) => (
        <Link to={`/athlete/${athlete.id}`}>{athlete.first_name}</Link>
      ),
    },
    {
      path: "last_name",
      label: "Apellido",
      classes: "align-middle",
      content: (athlete) => (
        <Link to={`/athlete/${athlete.id}`}> {athlete.last_name} </Link>
      ),
    },
    // { path: "email", label: "Email", classes: "align-middle" },
    // { path: "phone_number", label: "Teléfono", classes: "align-middle" },
    {
      path: "age",
      label: "Edad",
      classes: "align-middle",
      content: (athlete) => <span>{athlete.age} años</span>,
    },
    {
      path: "creation_date",
      label: "Creado (m/d/a)",
      align: "d-none d-md-table-cell d-lg-table-cell border-0",
      classes: "align-middle d-none d-md-table-cell d-lg-table-cell border-0",
    },
  ];

  deleteColumn = {
    key: "delete",
    classes: "align-middle",
    content: (athlete) => (
      <div className="text-center pl-2 pr-2">
        <span
          onClick={() => this.props.onDelete(athlete)}
          className="fa fa-trash"
          style={{ color: "red", fontSize: "24px", cursor: "pointer" }}
        ></span>
      </div>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser().email;
    const role = auth.getCurrentUser().role;

    if (user && (role === "Admin" || role === "Owner"))
      this.columns.push(this.deleteColumn);
  }

  render() {
    const { athletes, sortColumn, onSort } = this.props;

    return (
      <Table
        columns={this.columns}
        data={athletes}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default AthletesTable;
