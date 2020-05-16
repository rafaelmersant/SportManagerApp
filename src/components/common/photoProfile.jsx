import React, { Component } from "react";
import { defaultPhoto } from "../../variables";
import { toast } from "react-toastify";
import FileUploader from "react-firebase-file-uploader";
import firebase from "firebase/app";
import "firebase/storage";

class PhotoProfile extends Component {
  state = {
    avatar: "",
    photo: "",
    progress: 0,
    isUploading: false,
  };

  handleChangePhoto = (event) => {
    const file = event.target.files[0];

    this.setState({
      selectedPhoto: file,
      photo: URL.createObjectURL(event.target.files[0]),
    });
  };

  handleUploadStart = () => this.setState({ isUploading: true });

  handleProgress = (progress) => this.setState({ progress });

  handleUploadError = (error) => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = (filename) => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });

    firebase
      .storage()
      .ref("photos")
      .child(filename)
      .getDownloadURL()
      .then((url) => {
        this.setState({ photo: url });
        this.props.onChangePhoto({ url, filename, changed: true });
      });

    toast.success("Debe darle al boton GUARDAR para conservar la nueva foto.");
  };

  render() {
    const _photo = this.props.photo ? this.props.photo : defaultPhoto;

    let { photo, progress, isUploading } = { ...this.state };
    photo = photo ? photo : _photo;

    return (
      <React.Fragment>
        <div className="text-center">
          <div id="container"></div>
          <div
            className="border shadow rounded-circle d-inline-block"
            style={{
              width: "170px",
              height: "170px",
              backgroundImage: "url(" + photo + ")",
              backgroundSize: "cover",
              // transform: "rotate(90deg)"
            }}
          ></div>
        </div>
        <div className="text-center">
          {isUploading && (
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progress}%
              </div>
            </div>
          )}

          <label>
            <FileUploader
              hidden
              accept="image/*"
              name="avatar"
              randomizeFilename
              storageRef={firebase.storage().ref("photos")}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
              // metadata={{ cacheControl: "max-age=3600" }}
            />
            <h6 className="text-info" style={{ cursor: "pointer" }}>
              Cargar foto
            </h6>
          </label>
        </div>
      </React.Fragment>
    );
  }
}

export default PhotoProfile;
