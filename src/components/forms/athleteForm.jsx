import React, { Component } from "react";
import TabsAthlete from "../common/tabsAthlete";
import PhotoProfile from "../common/photoProfile";
import PersonalInfo from "../personalInfo";
import ParentInfo from "../parentInfo";
import DocumentInfo from "../documentInfo";

class AthleteForm extends Component {
  state = {
    data: {
      photo: "",
      filename: "",
    },
  };

  handleChangePhoto = (photo) => {
    if (photo.changed) {
      sessionStorage["newPhoto"] = photo.url;
      sessionStorage["newPhoto_filename"] = photo.filename;
    }

    const data = { ...this.state.data };
    data.photo = photo.url;
    data.filename = photo.filename;

    this.setState({ data });
  };

  render() {
    return (
      <div className="container col-xl-8 col-lg-9 col-md-12 col-sm-12 shadow pb-1 bg-white">
        <div className="text-center mb-2 pt-1">
          <div className="text-center">
            <PhotoProfile
              photo={this.state.data.photo}
              onChangePhoto={this.handleChangePhoto}
            />
          </div>
          <div className="mt-2">
            <TabsAthlete {...this.props} />
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
            <ParentInfo {...this.props} />
          </div>

          <div
            className="tab-pane fade"
            id="document"
            role="tabpanel"
            aria-labelledby="document-tab"
          >
            <DocumentInfo {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

export default AthleteForm;
