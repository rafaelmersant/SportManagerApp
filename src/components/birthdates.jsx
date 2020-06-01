import React, { Component } from "react";
import { getAthletesBirthdate } from "../services/athleteService";

class Birthdates extends Component {
  state = {
    athletes: [],
  };

  async componentDidMount() {
    const { data: athletes } = await getAthletesBirthdate(6);
    console.log(athletes);

    this.setState({ athletes });
  }

  render() {
    const { athletes } = { ...this.state };
    return (
      <React.Fragment>
        <div className="text-center">
          <h1>Cumpleaños del mes</h1>

          <div className="col-4 container mt-4">
            <ul className="list-group">
              {athletes.map((item) => (
                <li className="list-group-item d-flex" key={item.id}>
                  <span>
                    {item.first_name} {item.last_name}
                  </span>

                  <span className="font-italic font-weight-light pl-4 text-danger">
                    {item.birthday.substr(8, 2)}
                  </span>
                  {/* <div>
                    <span
                      className="fa fa-trash text-danger p-2"
                      style={{ fontSize: "22px", cursor: "pointer" }}
                    ></span>
                  </div> */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Birthdates;
