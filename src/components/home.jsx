import React from "react";
import { getCurrentUser } from "../services/authService";

const Home = () => {
  const user = getCurrentUser();

  return (
    <React.Fragment>
      <div className="text-center">
        <img
          style={{ width: "50%", maxWidth: "550px" }}
          src="https://firebasestorage.googleapis.com/v0/b/fenix-system-8a811.appspot.com/o/photos%2Ffenix.png?alt=media&token=8cf3ea67-39be-4647-8b2e-88a9966805e6"
          alt="FENIX"
        />
      </div>
      <div className="text-center mt-3 mb-2">
        {user && (
          <a
            href={`/frances`}
            className="btn btn-danger pl-5 pr-5 pb-2 pt-2 mr-2"
            style={{ backgroundColor: "#ee00aa" }}
          >
            Francés
          </a>
        )}

        {user && user.athleteId && (
          <a
            href={`/athlete/${user.athleteId}`}
            className="btn btn-info pl-5 pr-5 pb-2 pt-2 ml-2"
          >
            Mi Perfil
          </a>
        )}
      </div>
    </React.Fragment>
  );
};

export default Home;
