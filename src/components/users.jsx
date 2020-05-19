import React, { Component } from "react";
import { toast } from "react-toastify";
import Pagination from "react-js-pagination";
import SearchBox from "./common/searchBox";
import NewButton from "./common/newButton";
import { getUsers, getUsersByName, deleteUser } from "../services/userService";
import UsersTable from "./tables/usersTable";
import { getCurrentUser } from "../services/authService";

class Users extends Component {
  state = {
    users: [],
    totalUsers: 0,
    currentPage: 1,
    pageSize: 10,
    searchQuery: "",
    sortColumn: { path: "creation_date", order: "asc" },
  };

  async componentDidMount() {
    if (getCurrentUser().role === "Level2") window.location = "/";

    await this.populateUsers("", this.state.currentPage, this.state.sortColumn);
  }

  async populateUsers(query, page, sortColumn) {
    let users = [];
    const name = query.toUpperCase().split(" ").join("%20");

    try {
      if (name === "") {
        const { data: _users } = await getUsers(page, sortColumn);
        users = _users;
      } else {
        const { data: _users } = await getUsersByName(name, page, sortColumn);
        users = _users;
      }

      this.setState({
        users: users.results,
        totalUsers: users.count,
        loading: false,
      });

      this.forceUpdate();
    } catch (ex) {
      console.log(ex);
    }
  }

  handleDelete = async (user) => {
    const answer = window.confirm(
      "Esta seguro de eliminar este usuario? \nNo podrá deshacer esta acción"
    );
    if (answer) {
      const originalUsers = this.state.users;
      const users = this.state.users.filter((m) => m.id !== user.id);
      this.setState({ users });

      try {
        await deleteUser(user.id);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          toast.error("Este usuario ya fue eliminado");

        this.setState({ users: originalUsers });
      }
    }
  };

  handlePageChange = async (page) => {
    this.setState({ currentPage: page });

    if (this.state.searchQuery)
      await this.populateUsers(this.state.searchQuery, parseInt(page));
    else await this.populateUsers("", parseInt(page));
  };

  handleSearch = async (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });

    await this.populateUsers(
      query,
      this.state.currentPage,
      this.state.sortColumn
    );
  };

  handleSort = async (sortColumn) => {
    this.setState({ sortColumn });

    await this.populateUsers(
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
      totalUsers,
      users,
    } = this.state;
    const { user } = this.props;

    return (
      <div className="container">
        <div className="row">
          <div className="col margin-top-msg">
            <div className="mb-4">
              <NewButton label="Nuevo Usuario" to="/user/new" />
            </div>

            <SearchBox
              value={searchQuery}
              onChange={this.handleSearch}
              placeholder="Buscar..."
            />
            <UsersTable
              users={users}
              user={user}
              sortColumn={sortColumn}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
            />

            {!this.state.loading && users.length > 0 && (
              <div className="row">
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={pageSize}
                  totalItemsCount={totalUsers}
                  pageRangeDisplayed={5}
                  onChange={this.handlePageChange.bind(this)}
                  itemClass="page-item"
                  linkClass="page-link"
                />
                <p className="text-muted ml-3 mt-2">
                  <em>
                    Mostrando {users.length} de {totalUsers} usuarios
                  </em>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Users;
