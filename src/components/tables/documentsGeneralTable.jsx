import React, { Component } from "react";
import { getCurrentUser } from "../../services/authService";

class DocumentsGeneralTable extends Component {
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
    const user = getCurrentUser();

    return (
      <React.Fragment>
        <ul className="list-group">
          {documents.map((item) => (
            <li className="list-group-item d-flex" key={item.id}>
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
                {user && user.role === "Admin" && (
                  <span
                    onClick={() => this.props.onDelete(item)}
                    className="fa fa-trash text-danger p-2"
                    style={{ fontSize: "22px", cursor: "pointer" }}
                  ></span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }
}

export default DocumentsGeneralTable;
