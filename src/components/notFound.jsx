import React from "react";

const NotFound = () => {
  return (
    <div>
      <div className="text-center">
        <span
          className="fa fa-search text-muted"
          style={{ fontSize: "15em" }}
        ></span>
        <h1 className="text-secundary mt-3">Lo que busca no fue encontrado</h1>
        <a href="/">
          <h5 className="text-info mt-1">Ir a la pagina de Inicio</h5>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
