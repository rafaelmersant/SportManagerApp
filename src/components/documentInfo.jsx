import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import FileUploader from "react-firebase-file-uploader";
import Form from "./common/form";
import {
  getDocument,
  getDocuments,
  saveDocument,
  deleteDocument
} from "../services/athleteService";
import { getCurrentUser } from "../services/authService";
import DocumentsTable from "./tables/documentsTable";
import firebase from "firebase/app";
import "firebase/storage";

class DocumentInfo extends Form {
  state = {
    data: {
      id: 0,
      athlete_id: parseInt(this.props.match.params.id),
      title: "",
      document_url: "",
      document_filename: "",
      created_user: getCurrentUser().email,
      creation_date: new Date().toISOString()
    },
    documents: [],
    errors: {},
    documentName: "",
    progress: 0,
    isUploading: false
  };

  schema = {
    id: Joi.number(),
    athlete_id: Joi.number(),
    title: Joi.string()
      .required()
      .max(150)
      .label("Titulo"),
    document_url: Joi.string(),
    document_filename: Joi.string(),
    created_user: Joi.string(),
    creation_date: Joi.string()
  };

  async populateDocuments() {
    try {
      const athleteId = this.props.match.params.id;
      if (athleteId === "new") return;

      const { data: documents } = await getDocuments(athleteId);
      this.setState({
        documents
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateDocuments();
  }

  mapToViewModel(document) {
    return {
      id: document[0].id,
      athlete_id: document[0].athlete_id,
      title: document[0].title,
      document_url: document[0].document_url ? document[0].document_url : "",
      created_user: document[0].created_user
        ? document[0].created_user
        : getCurrentUser().email,
      creation_date: document[0].creation_date
    };
  }

  handleSort = () => {
    console.log("sorted");
  };

  handleDeleteDocument = async document => {
    const answer = window.confirm(
      `Seguro que desea eliminar: ${document.title}`
    );

    if (answer) {
      try {
        var deleted = await deleteDocument(document.id);

        firebase
          .storage()
          .ref("documents")
          .child(document.document_filename)
          .delete()
          .then(() => {
            console.log(`file ${document.document_filename} deleted`);
          })
          .catch(error => {
            console.log(error);
          });
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Este registro ya fue eliminado");
      }

      if (deleted && deleted.status === 200) {
        toast.success(`${document.title} fue eliminado con exito!`);
        this.populateDocuments();
      }
    }
  };

  handleEditDocument = async document => {
    const handler = e => {
      e.preventDefault();
    };
    handler(window.event);

    const { data: item } = await getDocument(document.id);

    if (item) {
      const data = {
        id: item[0].id,
        athlete_id: item[0].athlete.id,
        title: item[0].title,
        document_url: item[0].document_url,
        created_user: getCurrentUser().email,
        creation_date: new Date().toISOString()
      };

      this.setState({ data });
    }
  };

  handleUploadStart = () => this.setState({ isUploading: true });

  handleProgress = progress => this.setState({ progress });

  handleUploadError = error => {
    this.setState({ isUploading: false });
    toast.error(`Hubo un error al tratar de cargar el documento \n ${error}`);
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({
      documentName: filename,
      progress: 100,
      isUploading: false
    });

    const { data } = { ...this.state };

    firebase
      .storage()
      .ref("documents")
      .child(filename)
      .getDownloadURL()
      .then(url => {
        data.document_url = url;
        data.document_filename = filename;

        this.setState({ data });
      });
  };

  doSubmit = async () => {
    const { data } = { ...this.state };
    data.title = data.title.toUpperCase();

    try {
      const { data: document } = await saveDocument(data);

      data.id = 0;
      data.title = "";
      data.document_url = "";

      this.setState({ data });

      console.log(document);
    } catch (ex) {
      console.log(ex);
    }

    await this.populateDocuments();
    toast.success("Agregado con exito!");
  };

  render() {
    const { isUploading, progress, documents } = {
      ...this.state
    };

    return (
      <React.Fragment>
        <div>
          <h4 className="text-fenix-yellow bg-fenix-blue pl-1 pr-1 pt-1 pb-1">
            Agregar un Documento
          </h4>

          <div className="col-12 pb-3 mb-3 bg-light">
            <form onSubmit={this.handleSubmit}>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12">
                  {this.renderInput(
                    "title",
                    "",
                    "text",
                    "",
                    "Titulo del documento"
                  )}
                </div>

                <div className="col-lg-3 col-md-3 col-sm-12">
                  {isUploading && (
                    <div className="progress" style={{ marginTop: "38px" }}>
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
                  {!isUploading && (
                    <label style={{ marginTop: "35px" }}>
                      <FileUploader
                        hidden
                        accept="*"
                        name="document"
                        randomizeFilename
                        storageRef={firebase.storage().ref("documents")}
                        onUploadStart={this.handleUploadStart}
                        onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        onProgress={this.handleProgress}
                      />
                      <h6 className="text-info" style={{ cursor: "pointer" }}>
                        {this.state.data.document_url && (
                          <span className="fa fa-file text-warning"></span>
                        )}{" "}
                        Cargar documento
                      </h6>
                    </label>
                  )}
                </div>

                <div
                  className="col-lg-3 col-md-3 col-sm-12"
                  style={{ marginTop: "25px" }}
                >
                  {this.renderButton("Guardar")}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="row">
            <div className="col">
              {documents.length > 0 && (
                <div style={{ minHeight: "370px" }}>
                  <DocumentsTable
                    documents={documents}
                    sortColumn={{ path: "name", order: "asc" }}
                    onDelete={this.handleDeleteDocument}
                    onEdit={this.handleEditDocument}
                    onSort={this.handleSort}
                  />
                </div>
              )}

              {!documents.length > 0 && (
                <div
                  className="text-center mt-3"
                  style={{ paddingBottom: "10rem" }}
                >
                  <span
                    className="fa fa-folder-open text-muted"
                    style={{ fontSize: "7em" }}
                  ></span>
                  <h2 className="text-secondary">
                    Aún no ha agregado documentos
                  </h2>
                  <h4 className="text-secondary">Buen momento para iniciar</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default DocumentInfo;
