import React from "react";
import Joi from "joi-browser";
import { toast } from "react-toastify";
import FileUploader from "react-firebase-file-uploader";
import Form from "./common/form";
import {
  getDocuments,
  saveDocument,
  deleteDocument,
} from "../services/docServices";
import { getCurrentUser } from "../services/authService";
import DocumentsGeneralTable from "./tables/documentsGeneralTable";
import firebase from "firebase/app";
import "firebase/storage";

class Document extends Form {
  state = {
    data: {
      id: 0,
      description: "",
      category: "DOC",
      source: "Frances",
      doc_url: "",
      doc_filename: "",
      active: true,
      created_user: getCurrentUser().email,
      creation_date: new Date().toISOString(),
    },
    documents: [],
    errors: {},
    documentName: "",
    progress: 0,
    isUploading: false,
  };

  schema = {
    id: Joi.number(),
    description: Joi.string().required().max(100).label("Título del documento"),
    category: Joi.string(),
    source: Joi.string(),
    doc_url: Joi.optional(),
    doc_filename: Joi.optional(),
    active: Joi.optional(),
    created_user: Joi.string(),
    creation_date: Joi.string(),
  };

  async populateDocuments() {
    try {
      const source = "Frances";
      const { data: documents } = await getDocuments(source);

      this.setState({
        documents: documents.results,
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        return this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateDocuments();
  }

  handleSort = () => {
    console.log("sorted");
  };

  handleDeleteDocument = async (document) => {
    const answer = window.confirm(
      `Seguro que desea eliminar: ${document.description}`
    );

    if (answer) {
      try {
        var deleted = await deleteDocument(document.id);

        firebase
          .storage()
          .ref("frances")
          .child(document.doc_filename)
          .delete()
          .then(() => {
            console.log(`file ${document.doc_filename} deleted`);
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Este registro ya fue eliminado");
      }

      if (deleted && deleted.status === 200) {
        toast.success(`${document.description} fue eliminado con exito!`);
        this.populateDocuments();
      }
    }
  };

  handleEditDocument = async (document) => {
    const handler = (e) => {
      e.preventDefault();
    };
    handler(window.event);

    // const { data: item } = await getDocument(document.id);

    // if (item) {
    //   const data = {
    //     id: item[0].id,
    //     athlete_id: item[0].athlete.id,
    //     title: item[0].title,
    //     document_url: item[0].document_url,
    //     created_user: getCurrentUser().email,
    //     creation_date: new Date().toISOString(),
    //   };

    //   this.setState({ data });
    // }
  };

  handleUploadStart = () => this.setState({ isUploading: true });

  handleProgress = (progress) => this.setState({ progress });

  handleUploadError = (error) => {
    this.setState({ isUploading: false });
    toast.error(`Hubo un error al tratar de cargar el documento \n ${error}`);
    console.error(error);
  };

  handleUploadSuccess = (filename) => {
    this.setState({
      documentName: filename,
      progress: 100,
      isUploading: false,
    });

    const { data } = { ...this.state };

    firebase
      .storage()
      .ref("frances")
      .child(filename)
      .getDownloadURL()
      .then((url) => {
        data.doc_url = url;
        data.doc_filename = filename;

        this.setState({ data });
      });
  };

  doSubmit = async () => {
    const { data } = { ...this.state };

    try {
      const { data: document } = await saveDocument(data);

      data.id = 0;
      data.description = "";
      data.doc_url = "";

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
      ...this.state,
    };
    const user = getCurrentUser();

    return (
      <React.Fragment>
        <div className="container col-lg-6 col-xl-6 col-md-7 col-sm-12">
          <h4 className="text-center text-info font-weight-bold mt-3">
            Material de Estudio para Francés
          </h4>

          {user && user.role === "Admin" && (
            <div className="col-12 pb-3 mb-3">
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    {this.renderInput(
                      "description",
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
                          name="frances"
                          randomizeFilename
                          storageRef={firebase.storage().ref("frances")}
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
          )}
        </div>

        <div>
          <div className="container col-lg-7 col-xl-7 col-md-7 col-sm-12 mt-4">
            <div className="col">
              {documents.length > 0 && (
                <div style={{ minHeight: "370px" }}>
                  <DocumentsGeneralTable
                    documents={documents}
                    onDelete={this.handleDeleteDocument}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Document;
