import React, { Component } from "react";
import { toast } from "react-toastify";
import _ from "lodash";
import Pagination from "./common/pagination";
import SearchBox from "./common/searchBox";
import NewButton from "./common/newButton";
import Loading from "./common/loading";
import { paginate } from "../utils/paginate";
import { getAthletes, deleteAthlete } from "../services/athleteService";
import AthletesTable from "./tables/athletesTable";

class Athletes extends Component {
  state = {
    loading: true,
    athletes: [],
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    sortColumn: { path: "creationDate", order: "desc" }
  };

  async componentDidMount() {
    const { data: athletes } = await getAthletes();

    this.setState({ athletes, loading: false });
  }

  handleDelete = async athlete => {
    const answer = window.confirm(
      "Esta seguro de eliminar este atleta? \nNo podrá deshacer esta acción"
    );
    if (answer) {
      const originalAthletes = this.state.athletes;
      const athletes = this.state.athletes.filter(m => m.id !== athlete.id);
      this.setState({ athletes });

      try {
        await deleteAthlete(athlete.id);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Este atleta ya fue eliminado");

        this.setState({ athletes: originalAthletes });
      }
    }
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      athletes: allAthletes
    } = this.state;

    let filtered = allAthletes;
    if (searchQuery)
      filtered = allAthletes.filter(m =>
        `${m.first_name.toLowerCase()} ${m.last_name.toLowerCase()}`.startsWith(
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

            {!this.state.loading && (
              <div className="row">
                <Pagination
                  itemsCount={totalCount}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={this.handlePageChange}
                />
                <p className="text-muted ml-3 mt-2">
                  <em>Mostrando {totalCount} atletas</em>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Athletes;
