import React, { Component } from "react";
import Table from "../common/table";
import auth from "../../services/authService";

class ParentsTable extends Component {
  columns = [
    { path: "name", label: "Nombre" },
    { path: "career", label: "Profesión" },
    { path: "phone_number", label: "Teléfono" },
    { path: "email", label: "Email" },
  ];

  actionColumn = {
    path: "action",
    key: "action",
    classes: "text-center",
    content: (parent) => (
      <div>
        <div className="d-inline-block mr-1">
          <span
            onClick={() => this.props.onDelete(parent)}
            className="fa fa-trash text-danger"
            style={{ fontSize: "22px", cursor: "pointer" }}
          ></span>
        </div>
        <div className="d-inline-block ml-1">
          <span
            onClick={() => this.props.onEdit(parent)}
            className="fa fa-edit text-warning"
            style={{ fontSize: "22px", cursor: "pointer" }}
          ></span>
        </div>
      </div>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser().email;
    const role = auth.getCurrentUser().role;

    if (user && (role === "Admin" || role === "Owner"))
      this.columns.push(this.actionColumn);
  }

  render() {
    const { parents, sortColumn, onSort } = this.props;

    return (
      <Table
        columns={this.columns}
        data={parents}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ParentsTable;
