import React, { Component } from "react";
import Table from "../common/table";
import auth from "../../services/authService";

class DocumentsGeneralTable extends Component {
  // columns = [
  //   { path: "description", label: "Descripción del Documento" },
  //   {
  //     path: "document_url",
  //     label: "Archivo",
  //     align: "text-center",
  //     classes: "text-center",
  //     content: (document) => (
  //       <a href={document.doc_url} target="_blank" rel="noopener noreferrer">
  //         <div className="text-center">
  //           <span>{document.description}</span>
  //         </div>
  //       </a>
  //     ),
  //   },
  //   {
  //     path: "creation_date",
  //     label: "Agregado",
  //     align: "text-center",
  //     classes: "text-center",
  //   },
  // ];

  // actionColumn = {
  //   path: "action",
  //   key: "action",
  //   classes: "text-center",
  //   content: (document) => (
  //     <div>
  //       <div className="d-inline-block mr-1">
  //         <span
  //           onClick={() => this.props.onDelete(document)}
  //           className="fa fa-trash text-danger"
  //           style={{ fontSize: "22px", cursor: "pointer" }}
  //         ></span>
  //       </div>
  //       <div className="d-inline-block ml-1">
  //         <span
  //           onClick={() => this.props.onEdit(document)}
  //           className="fa fa-edit text-warning"
  //           style={{ fontSize: "22px", cursor: "pointer" }}
  //         ></span>
  //       </div>
  //     </div>
  //   ),
  // };

  constructor() {
    super();
    const user = auth.getCurrentUser().email;
    const role = auth.getCurrentUser().role;

    // if (user && (role === "Admin" || role === "Owner"))
    //   this.columns.push(this.actionColumn);
  }

  formatDate = (stringDate) => {
    const date = new Date(stringDate);

    let timeFormatted = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const dateFormatted = date
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .split(" ")
      .join("-");

    return `${dateFormatted} ${timeFormatted}`;
  };

  render() {
    const { documents } = this.props;

    return (
      <React.Fragment>
        <ul className="list-group">
          {documents.map((item) => (
            <li className="list-group-item d-flex">
              <a
                href={item.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-auto p-2"
              >
                <span>{item.description}</span>
              </a>
              <span className="font-italic font-weight-light p-2">
                {this.formatDate(item.creation_date)}
              </span>
              <div>
                <span
                  onClick={() => this.props.onDelete(item)}
                  className="fa fa-trash text-danger p-2"
                  style={{ fontSize: "22px", cursor: "pointer" }}
                ></span>
              </div>
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default DocumentsGeneralTable;
