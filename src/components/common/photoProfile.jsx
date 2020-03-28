import React, { Component } from "react";
import { defaultPhoto } from "../../variables";
import firebaseConfig from "../../firebaseConfig";
import FileUploader from "react-firebase-file-uploader";
import firebase from "firebase";

firebase.initializeApp(firebaseConfig);

class PhotoProfile extends Component {
  state = {
    avatar: "",
    photo: null,
    progress: 0,
    isUploading: false
  };

  handleChangePhoto = event => {
    const file = event.target.files[0];

    this.setState({
      selectedPhoto: file,
      photo: URL.createObjectURL(event.target.files[0])
    });
  };

  handleUploadStart = () => this.setState({ isUploading: true });

  handleProgress = progress => this.setState({ progress });

  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });

    firebase
      .storage()
      .ref("photos")
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({ photo: url });
        this.props.onChangePhoto(url);
      });
  };

  render() {
    const _photo = this.props.photo ? this.props.photo : defaultPhoto;

    let { photo, progress } = { ...this.state };
    photo = photo ? photo : _photo;

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
          {progress > 0 && progress !== 100 && (
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
