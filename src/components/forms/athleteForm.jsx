import React, { Component } from "react";
import TabsAthlete from "../common/tabsAthlete";
import PhotoProfile from "../common/photoProfile";
import PersonalInfo from "../personalInfo";

class AthleteForm extends Component {
  state = {
    data: {
      photo: ""
    }
  };

  handleChangePhoto = photo => {
    const data = { ...this.state.data };
    data.photo = photo;
    this.setState({ data });
  };

  render() {
    return (
      <div className="container col-lg-8 col-md-12 col-sm-12 shadow mb-5 bg-white">
        <div className="text-center mb-2 pt-1">
          <div className="text-center">
            <PhotoProfile photo={this.state.data.photo} />
          </div>
          <div className="mt-2">
            <TabsAthlete />
          </div>
        </div>

        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active pb-2"
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            <PersonalInfo
              {...this.props}
              onChangePhoto={this.handleChangePhoto}
            />
          </div>
          <div
            className="tab-pane fade"
            id="parent"
            role="tabpanel"
            aria-labelledby="parent-tab"
          >
            ...
          </div>
          <div
            className="tab-pane fade"
            id="document"
            role="tabpanel"
            aria-labelledby="document-tab"
          >
            ...
          </div>
        </div>
      </div>
    );
  }
}

export default AthleteForm;
