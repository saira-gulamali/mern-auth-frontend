import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";

import { FaTrash } from "react-icons/fa";
import PageMenu from "../../components/pageMenu/PageMenu";
import Search from "../../components/search/Search";
import UserStats from "../../components/userStats/UserStats";

import "./UserList.scss";
import ChangeRole from "../../components/changeRole/ChangeRole";
import { useDispatch, useSelector } from "react-redux";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "../../redux/features/auth/authSlice";
import { Spinner } from "../../components/loader/Loader";
import {
  FILTER_USERS,
  selectUsers,
} from "../../redux/features/auth/filterSlice";
import ReactPaginate from "react-paginate";

const UserList = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const { users, isLoading } = useSelector((state) => state.auth);
  const filteredUsers = useSelector(selectUsers);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const removeUser = async (id) => {
    await dispatch(deleteUser(id));
    dispatch(getUsers());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete This User",
      message: "Are you sure you want to delete this user?",
      buttons: [
        {
          label: "Delete",
          onClick: () => removeUser(id),
        },
        {
          label: "Cancel",
          // onClick: () => alert("Click No"),
        },
      ],
    });
  };

  useEffect(() => {
    dispatch(FILTER_USERS({ users, search }));
  }, [dispatch, users, search]);

  // begin pagination

  const itemsPerPage = 5;

  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredUsers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

  //invoke when user requests another page
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredUsers.length;

    setItemOffset(newOffset);
  };
  // end pagination

  return (
    <section>
      <div className="container">
        <PageMenu />
        <UserStats />
        <div className="user-list">
          {isLoading && <Spinner />}
          <div className="table">
            <div className="--flex-between">
              <span>
                <h3>All Users</h3>
              </span>
              <span>
                <Search
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </span>
            </div>
            {!isLoading && users.length === 0 ? (
              <p>No users found...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>s/n</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Change Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((item, index) => {
                    const { name, role, email, _id } = item;

                    return (
                      <tr key={_id}>
                        <td>{index + 1}</td>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>{role}</td>
                        <td>
                          <ChangeRole id={_id} email={email} />
                        </td>
                        <td>
                          <span>
                            <FaTrash
                              size={20}
                              color="red"
                              onClick={() => confirmDelete(_id)}
                            />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <hr />
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="Prev"
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            pageLinkClassName="page-num"
            previousLinkClassName="page-num"
            nextLinkClassName="page-num"
            activeLinkClassName="activePage"
          />
        </div>
      </div>
    </section>
  );
};

export default UserList;
