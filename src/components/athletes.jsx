import React, { Component } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import Pagination from "react-js-pagination";
import SearchBox from "./common/searchBox";
import NewButton from "./common/newButton";
import Loading from "./common/loading";
import { paginate } from "../utils/paginate";
import { getAthletes, deleteAthlete } from "../services/athleteService";
import AthletesTable from "./tables/athletesTable";
import firebase from "firebase/app";
import "firebase/storage";

class Athletes extends Component {
  state = {
    loading: true,
    athletes: [],
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    sortColumn: { path: "creationDate", order: "desc" },
  };

  async componentDidMount() {
    const { data: athletes } = await getAthletes();

    this.setState({ athletes, loading: false });
  }

  handleDelete = async (athlete) => {
    const answer = window.confirm(
      `Esta seguro de eliminar al atleta ${athlete.first_name} ${athlete.last_name}? \nNo podrá deshacer esta acción`
    );
    if (answer) {
      const originalAthletes = this.state.athletes;
      const athletes = this.state.athletes.filter((m) => m.id !== athlete.id);
      this.setState({ athletes });

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
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Este atleta ya fue eliminado");

        this.setState({ athletes: originalAthletes });
      }
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      athletes: allAthletes,
    } = this.state;

    let filtered = allAthletes;
    if (searchQuery)
      filtered = allAthletes.filter((m) =>
        `${m.first_name.toLowerCase()} ${m.last_name.toLowerCase()}`.includes(
          searchQuery.toLocaleLowerCase()
        )
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const athletes = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, athletes };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    const { totalCount, athletes } = this.getPagedData();

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
                {/* <Pagination
                  itemsCount={totalCount}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={this.handlePageChange}
                /> */}
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={pageSize}
                  totalItemsCount={totalCount}
                  pageRangeDisplayed={5}
                  onChange={this.handlePageChange.bind(this)}
                  itemClass="page-item"
                  linkClass="page-link"
                />
                <p className="text-muted ml-3 mt-2">
                  <em>
                    Mostrando {athletes.length} de {totalCount} atletas
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
