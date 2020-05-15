import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import SearchBox from "./common/searchBox";
import NewButton from "./common/newButton";
import Loading from "./common/loading";
import {
  getAthletes,
  deleteAthlete,
  getAthletesByName,
} from "../services/athleteService";
import AthletesTable from "./tables/athletesTable";
import firebase from "firebase/app";
import "firebase/storage";
import { getCurrentUser } from "../services/authService";

class Athletes extends Component {
  state = {
    loading: true,
    athletes: [],
    totalAthletes: 0,
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    sortColumn: { path: "creationDate", order: "desc" },
  };

  componentWillMount() {
    const user = getCurrentUser();
    if (user.role === "Level2") window.location = `/athlete/${user.athleteId}`;
  }

  async componentDidMount() {
    await this.populateAthletes(
      "",
      this.state.currentPage,
      this.state.sortColumn
    );
  }

  async populateAthletes(query, page, sortColumn) {
    let athletes = [];
    const name = query.toUpperCase().split(" ").join("%20");

    try {
      if (name === "") {
        const { data: prods } = await getAthletes(page, sortColumn);
        athletes = prods;
      } else {
        const { data: prods } = await getAthletesByName(name, page, sortColumn);
        athletes = prods;
      }

      this.setState({
        athletes: athletes.results,
        totalAthletes: athletes.count,
        loading: false,
      });

      this.forceUpdate();
    } catch (ex) {
      console.log(ex);
    }
  }

  handleDelete = async (athlete) => {
    const answer = window.confirm(
      `Esta seguro de eliminar al atleta ${athlete.first_name} ${athlete.last_name}? \nNo podrá deshacer esta acción`
    );
    if (answer) {
      try {
        await deleteAthlete(athlete.id);

        //Remove old photo from firebase
        if (athlete.photo_filename)
          firebase
            .storage()
            .ref("photos")
            .child(athlete.photo_filename)
            .delete()
            .then(() => {
              console.log(`file ${athlete.photo_filename} deleted`);
            })
            .catch((error) => {
              console.log(error);
            });

        await this.populateAthletes(
          "",
          this.state.currentPage,
          this.state.sortColumn
        );
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Este atleta ya fue eliminado");
      }
    }
  };

  handlePageChange = async (page) => {
    this.setState({ currentPage: page });

    if (this.state.searchQuery)
      await this.populateAthletes(this.state.searchQuery, parseInt(page));
    else await this.populateAthletes("", parseInt(page));
  };

  handleSearch = async (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });

    await this.populateAthletes(
      query,
      this.state.currentPage,
      this.state.sortColumn
    );
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });

    await this.populateAthletes(
      this.state.searchQuery,
      this.state.currentPage,
      sortColumn
    );
  };

  render() {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      totalAthletes,
      athletes,
    } = this.state;
    const { user } = this.props;

    return (
      <div className="container">
        <div className="row">
          <div className="col margin-top-msg">
            <h5 className="pull-left text-fenix-blue mt-2">
              Listado de Atletas
            </h5>
            <div className="mb-4">
              <NewButton label="Nuevo Atleta" to="/athlete/new" />
            </div>

            <SearchBox
              value={searchQuery}
              onChange={this.handleSearch}
              placeholder="Buscar..."
            />

            {this.state.loading && (
              <div className="d-flex justify-content-center mb-3">
                <Loading />
              </div>
            )}

            {!this.state.loading && athletes.length > 0 && (
              <AthletesTable
                athletes={athletes}
                user={user}
                sortColumn={sortColumn}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
              />
            )}

            {!this.state.loading && athletes.length > 0 && (
              <div className="row">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={pageSize}
                  totalItemsCount={totalAthletes}
                  pageRangeDisplayed={5}
                  onChange={this.handlePageChange.bind(this)}
                  itemClass="page-item"
                  linkClass="page-link"
                />
                <p className="text-muted ml-3 mt-2">
                  <em>
                    Mostrando {athletes.length} de {totalAthletes} atletas
                  </em>
                </p>
              </div>
            )}

            {!athletes.length > 0 && (
              <div
                className="text-center mt-3"
                style={{ paddingBottom: "8rem" }}
              >
                <span
                  className="fa fa-user text-muted"
                  style={{ fontSize: "6em" }}
                ></span>
                <h2 className="text-secondary">Aún no ha agregado atletas</h2>
                <h4 className="text-secondary">Buen momento para iniciar</h4>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Athletes;
