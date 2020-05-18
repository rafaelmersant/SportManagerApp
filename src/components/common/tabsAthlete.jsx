import React from "react";

const TabsAthlete = (props) => {
  return (
    <ul className="nav nav-tabs" id="myTab" role="tablist">
      <li className="nav-item">
        <a
          className="nav-link active"
          id="profile-tab"
          data-toggle="tab"
          href="#profile"
          role="tab"
          aria-controls="profile"
          aria-selected="true"
        >
          Perfil
        </a>
      </li>
      {props.match.params.id !== "new" && (
        <li className="nav-item">
          <a
            className="nav-link"
            id="parent-tab"
            data-toggle="tab"
            href="#parent"
            role="tab"
            aria-controls="parent"
            aria-selected="false"
          >
            Padres/tutores
          </a>
        </li>
      )}
      {props.match.params.id !== "new" && (
        <li className="nav-item">
          <a
            className="nav-link"
            id="document-tab"
            data-toggle="tab"
            href="#document"
            role="tab"
            aria-controls="document"
            aria-selected="false"
          >
            Documentos
          </a>
        </li>
      )}
    </ul>
  );
};

export default TabsAthlete;
