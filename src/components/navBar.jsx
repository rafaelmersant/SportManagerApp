import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light shadow-sm"
      style={{ padding: ".1rem .1rem" }}
    >
      <NavLink className="navbar-brand" to="/">
        <img
          width="60px"
          src="https://firebasestorage.googleapis.com/v0/b/fenix-system-8a811.appspot.com/o/photos%2Ffenix.png?alt=media&token=8cf3ea67-39be-4647-8b2e-88a9966805e6"
          alt="FENIX"
        />
      </NavLink>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {!user && (
        <div className="text-center w-100">
          <h2 className="text-fenix-blue">Club Acuático LOS FÉNIX</h2>
        </div>
      )}

      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
          {user && (
            <li className="nav-item">
              {user.role !== "Level2" && (
                <a href="/athletes/" className="nav-link">
                  Atletas
                </a>
              )}
              {user.role === "Level2" && (
                <a href={`/athlete/${user.athleteId}`} className="nav-link">
                  Mi Perfil
                </a>
              )}
            </li>
          )}

          {user &&
            user.role === "Admin" &&
            user.email === "rafaelmersant@yahoo.com" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/users">
                  Usuarios
                </NavLink>
              </li>
            )}
        </ul>

        <div className="navbar-text">
          {!user && (
            <React.Fragment>
              <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Iniciar sesión
                  </NavLink>
                </li>
              </ul>
            </React.Fragment>
          )}
        </div>

        <div className="navbar-text">
          {user && (
            <React.Fragment>
              <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                <li className="nav-item">
                  <NavLink
                    className="nav-link mr-sm-2 active"
                    to={`/user/${user.id}`}
                  >
                    {user.name}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link my-2 my-sm-0" to="/logout">
                    Cerrar sesión
                  </NavLink>
                </li>
              </ul>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
