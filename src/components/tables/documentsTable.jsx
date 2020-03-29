import React, { Component } from "react";
import Table from "../common/table";
import auth from "../../services/authService";

class DocumentsTable extends Component {
  columns = [
    { path: "title", label: "Titulo" },
    {
      path: "document_url",
      label: "Archivo",
      align: "text-center",
      classes: "text-center",
      content: document => (
        <a
          href={document.document_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="text-center">
            <span className="fa fa-file"></span>
          </div>
        </a>
      )
    },
    {
      path: "creation_date",
      label: "Agregado",
      align: "text-center",
      classes: "text-center"
    }
  ];

  actionColumn = {
    path: "action",
    key: "action",
    classes: "text-center",
    content: document => (
      <div>
        <div className="d-inline-block mr-1">
          <span
            onClick={() => this.props.onDelete(document)}
            className="fa fa-trash text-danger"
            style={{ fontSize: "22px", cursor: "pointer" }}
          ></span>
        </div>
        <div className="d-inline-block ml-1">
          <span
            onClick={() => this.props.onEdit(document)}
            className="fa fa-edit text-warning"
            style={{ fontSize: "22px", cursor: "pointer" }}
          ></span>
        </div>
      </div>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser().email;
    const role = auth.getCurrentUser().role;

    if (user && (role === "Admin" || role === "Owner"))
      this.columns.push(this.actionColumn);
  }

  render() {
    const { documents, sortColumn, onSort } = this.props;

    return (
      <Table
        columns={this.columns}
        data={documents}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default DocumentsTable;
