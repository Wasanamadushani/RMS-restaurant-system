import React, { useEffect, useState } from "react";
import axios from "axios";
// import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalCustomers: 0,
    blockedUsers: 0,
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    let temp = [...users];

    if (roleFilter !== "All") {
      temp = temp.filter((user) => user.role === roleFilter);
    }

    if (search !== "") {
      temp = temp.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredUsers(temp);
  }, [users, search, roleFilter]);

  // ==========================
  // Get Users
  // ==========================
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");

      setUsers(res.data);
      setFilteredUsers(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Statistics
  // ==========================
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/stats"
      );

      setStats(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Block User
  // ==========================
  const blockUser = async (id) => {

    if (!window.confirm("Block this user?")) return;

    try {

      await axios.put(
        `http://localhost:5000/api/users/block/${id}`
      );

      fetchUsers();
      fetchStats();

    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Unblock User
  // ==========================
  const unblockUser = async (id) => {

    if (!window.confirm("Unblock this user?")) return;

    try {

      await axios.put(
        `http://localhost:5000/api/users/unblock/${id}`
      );

      fetchUsers();
      fetchStats();

    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Delete User
  // ==========================
  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user permanently?")) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/users/${id}`
      );

      fetchUsers();
      fetchStats();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="admin-users">

      <h1>User Management</h1>

      {/* Cards */}

      <div className="user-stats">

        <div className="stat-card">
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div className="stat-card">
          <h2>{stats.totalAdmins}</h2>
          <p>Admins</p>
        </div>

        <div className="stat-card">
          <h2>{stats.totalCustomers}</h2>
          <p>Customers</p>
        </div>

        <div className="stat-card">
          <h2>{stats.blockedUsers}</h2>
          <p>Blocked Users</p>
        </div>

      </div>

      {/* Search */}

      <div className="user-toolbar">

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
        >
          <option value="All">All</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>

      </div>

      {/* Table */}

      <table className="user-table">

        <thead>

          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {filteredUsers.length > 0 ? (

            filteredUsers.map((user) => (

              <tr key={user._id}>

                <td>{user.name}</td>

                <td>{user.email}</td>

                <td>

                  <span
                    className={
                      user.role === "admin"
                        ? "role-admin"
                        : "role-customer"
                    }
                  >
                    {user.role}
                  </span>

                </td>

                <td>

                  <span
                    className={
                      user.isBlocked
                        ? "blocked"
                        : "active"
                    }
                  >
                    {user.isBlocked
                      ? "Blocked"
                      : "Active"}
                  </span>

                </td>

                <td>

                  {user.isBlocked ? (

                    <button
                      className="action-btn unblock-btn"
                      onClick={() =>
                        unblockUser(user._id)
                      }
                    >
                      Unblock
                    </button>

                  ) : (

                    <button
                      className="action-btn block-btn"
                      onClick={() =>
                        blockUser(user._id)
                      }
                    >
                      Block
                    </button>

                  )}

                  <button
                    className="action-btn delete-btn"
                    onClick={() =>
                      deleteUser(user._id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td colSpan="5">
                No users found.
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default AdminUsers;