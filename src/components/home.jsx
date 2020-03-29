import React from "react";

const Home = () => {
  return (
    <div className="text-center">
      <img
        style={{ width: "50%" }}
        src={process.env.PUBLIC_URL + "/images/fenix.png"}
        alt="FENIX"
      />
    </div>
  );
};

export default Home;
