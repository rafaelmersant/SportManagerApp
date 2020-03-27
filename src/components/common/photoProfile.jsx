import React, { Component } from "react";

class PhotoProfile extends Component {
  state = {
    selectedPhoto: null,
    photo: null
  };

  handleChangePhoto = event => {
    const file = event.target.files[0];

    this.setState({
      selectedPhoto: file,
      photo: URL.createObjectURL(event.target.files[0])
    });
  };

  handleUpdatePhoto = () => {
    const handler = e => {
      e.preventDefault();
    };
    handler(window.event);
    console.log(this.state.selectedPhoto);

    // const fd = new FormData();
    // fd.append("image", this.state.selectedPhoto, this.state.selectedPhoto.name);
    // axios.post("/photos/", fd).then(res => {
    //   console.log(res);
    // });
  };

  render() {
    const _photo = this.props.photo ? this.props.photo : "profile-default.png";
    const __photo = process.env.PUBLIC_URL + `/photos/${_photo}`;
    let { photo } = { ...this.state };
    photo = photo ? photo : __photo;

    return (
      <React.Fragment>
        <div className="text-center">
          <div
            className="border shadow rounded-circle d-inline-block"
            style={{
              width: "170px",
              height: "170px",
              backgroundImage: "url(" + photo + ")",
              backgroundSize: "cover"
            }}
          ></div>
        </div>
        <div className="text-center">
          <input
            style={{ display: "none" }}
            type="file"
            onChange={this.handleChangePhoto}
            ref={fileInput => (this.fileInput = fileInput)}
          />
          <button onClick={this.handleUpdatePhoto}>Cargar photo</button>

          <a
            href="javascript:void(0)"
            className="text-small d-block mt-1"
            onClick={() => this.fileInput.click()}
          >
            <h6>Cambiar foto</h6>
          </a>
        </div>
      </React.Fragment>
    );
  }
}

export default PhotoProfile;
