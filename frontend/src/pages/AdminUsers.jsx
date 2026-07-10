import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaKey,
  FaTrash,
  FaBan,
  FaCheck,
  FaUsers,
  FaUserTie,
  FaUserClock,
} from "react-icons/fa";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import DashboardTable from "../components/DashboardTable";

const emptyStaffForm = {
  name: "",
  email: "",
  phone: "",
  role: "kitchen",
  password: "",
  availability: "available",
};

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalCustomers: 0,
    totalKitchenStaff: 0,
    totalDeliveryStaff: 0,
    totalCashiers: 0,
    availableStaff: 0,
    busyStaff: 0,
    blockedStaff: 0,
    blockedUsers: 0,
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [staffSearch, setStaffSearch] = useState("");

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffModalMode, setStaffModalMode] = useState("create");
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [staffForm, setStaffForm] = useState(emptyStaffForm);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchStaffUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStaffUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/staff");
      setStaffUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredUsers = useMemo(() => {
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

    return temp;
  }, [users, search, roleFilter]);

  const filteredStaffUsers = useMemo(() => {
    const query = staffSearch.toLowerCase();

    return staffUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query)
    );
  }, [staffUsers, staffSearch]);

  const openCreateStaffModal = () => {
    setStaffModalMode("create");
    setSelectedStaffId(null);
    setStaffForm(emptyStaffForm);
    setStaffModalOpen(true);
  };

  const openEditStaffModal = (staff) => {
    setStaffModalMode("edit");
    setSelectedStaffId(staff._id);
    setStaffForm({
      name: staff.name || "",
      email: staff.email || "",
      phone: staff.phone || "",
      role: staff.role || "kitchen",
      password: "",
      availability: staff.availability || "available",
    });
    setStaffModalOpen(true);
  };

  const openResetPasswordModal = (staff) => {
    setSelectedStaffId(staff._id);
    setPasswordForm("");
    setPasswordModalOpen(true);
  };

  const closeModals = () => {
    setStaffModalOpen(false);
    setPasswordModalOpen(false);
    setSelectedStaffId(null);
    setStaffForm(emptyStaffForm);
    setPasswordForm("");
  };

  const handleStaffChange = (e) => {
    setStaffForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveStaff = async (e) => {
    e.preventDefault();

    try {
      if (staffModalMode === "create") {
        await axios.post("http://localhost:5000/api/users/staff", staffForm);
      } else {
        await axios.put(
          `http://localhost:5000/api/users/staff/${selectedStaffId}`,
          {
            name: staffForm.name,
            email: staffForm.email,
            phone: staffForm.phone,
            role: staffForm.role,
            availability: staffForm.availability,
          }
        );
      }

      closeModals();
      fetchUsers();
      fetchStaffUsers();
      fetchStats();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to save staff member");
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/users/staff/${selectedStaffId}/reset-password`,
        { password: passwordForm }
      );

      closeModals();
      fetchUsers();
      fetchStaffUsers();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  const toggleBlock = async (user) => {
    try {
      if (user.isBlocked) {
        await axios.put(`http://localhost:5000/api/users/unblock/${user._id}`);
      } else {
        await axios.put(`http://localhost:5000/api/users/block/${user._id}`);
      }

      fetchUsers();
      fetchStaffUsers();
      fetchStats();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
      fetchStaffUsers();
      fetchStats();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="User Management"
        subtitle="Create staff accounts, manage access, and keep the same dashboard design across the app."
        actions={
          <button className="dashboard-action-btn" onClick={openCreateStaffModal}>
            <FaPlus /> Add Staff
          </button>
        }
      />

      <DashboardStats
        items={[
          { title: "Total Users", value: stats.totalUsers, icon: <FaUsers /> },
          { title: "Admins", value: stats.totalAdmins, icon: <FaUsers /> },
          { title: "Customers", value: stats.totalCustomers, icon: <FaUsers /> },
          { title: "Kitchen Staff", value: stats.totalKitchenStaff, icon: <FaUserTie /> },
          { title: "Delivery Staff", value: stats.totalDeliveryStaff, icon: <FaUserTie /> },
          { title: "Cashiers", value: stats.totalCashiers, icon: <FaUserTie /> },
          { title: "Available Staff", value: stats.availableStaff, icon: <FaUserClock /> },
          { title: "Busy Staff", value: stats.busyStaff, icon: <FaUserClock /> },
          { title: "Blocked Staff", value: stats.blockedStaff, icon: <FaBan /> },
        ]}
      />

      <DashboardTable
        title="Staff Management"
        subtitle="Kitchen, delivery, and cashier accounts are created only by admin"
        searchValue={staffSearch}
        onSearchChange={(e) => setStaffSearch(e.target.value)}
        searchPlaceholder="Search staff..."
        columns={[
          "Name",
          "Email",
          "Phone",
          "Role",
          "Availability",
          "Status",
          "Actions",
        ]}
        rows={filteredStaffUsers}
        emptyMessage="No staff found"
        renderRow={(staff) => (
          <tr key={staff._id}>
            <td>{staff.name}</td>
            <td>{staff.email}</td>
            <td>{staff.phone || "-"}</td>
            <td>
              <span className="role-staff">{staff.role}</span>
            </td>
            <td>
              <span className={`dashboard-pill status-${staff.availability}`}>
                {staff.availability}
              </span>
            </td>
            <td>
              <span className={staff.isBlocked ? "blocked" : "active"}>
                {staff.isBlocked ? "Blocked" : "Active"}
              </span>
            </td>
            <td>
              <div className="dashboard-action-group">
                <button
                  className="dashboard-action-btn"
                  onClick={() => openEditStaffModal(staff)}
                >
                  <FaEdit /> Edit
                </button>

                <button
                  className="dashboard-action-btn"
                  onClick={() => openResetPasswordModal(staff)}
                >
                  <FaKey /> Reset Password
                </button>

                <button
                  className={`dashboard-action-btn ${staff.isBlocked ? "" : "dashboard-action-btn-danger"}`}
                  onClick={() => toggleBlock(staff)}
                >
                  {staff.isBlocked ? <FaCheck /> : <FaBan />} {staff.isBlocked ? "Unblock" : "Block"}
                </button>

                <button
                  className="dashboard-action-btn dashboard-action-btn-danger"
                  onClick={() => deleteUser(staff._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <DashboardTable
        title="All Users"
        subtitle="Customer and admin accounts remain in the same management view"
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search users..."
        columns={["Name", "Email", "Role", "Status", "Actions"]}
        rows={filteredUsers}
        emptyMessage="No users found"
        renderRow={(user) => (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <span
                className={
                  user.role === "admin"
                    ? "role-admin"
                    : user.role === "customer"
                      ? "role-customer"
                      : "role-staff"
                }
              >
                {user.role}
              </span>
            </td>
            <td>
              <span className={user.isBlocked ? "blocked" : "active"}>
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </td>
            <td>
              <div className="dashboard-action-group">
                <button className="dashboard-action-btn" onClick={() => toggleBlock(user)}>
                  {user.isBlocked ? <FaCheck /> : <FaBan />} {user.isBlocked ? "Unblock" : "Block"}
                </button>

                <button
                  className="dashboard-action-btn dashboard-action-btn-danger"
                  onClick={() => deleteUser(user._id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <div className="user-toolbar" style={{ marginTop: "20px" }}>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="kitchen">Kitchen</option>
          <option value="delivery">Delivery</option>
          <option value="cashier">Cashier</option>
        </select>
      </div>

      {staffModalOpen && (
        <div className="dashboard-modal-backdrop" onClick={closeModals}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <h2>{staffModalMode === "create" ? "Create Staff" : "Edit Staff"}</h2>
              <button className="dashboard-modal-close" onClick={closeModals}>
                ×
              </button>
            </div>

            <form className="dashboard-modal-form" onSubmit={saveStaff}>
              <div className="dashboard-modal-grid">
                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={staffForm.name}
                    onChange={handleStaffChange}
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={staffForm.email}
                    onChange={handleStaffChange}
                    required
                  />
                </label>

                <label>
                  Phone
                  <input
                    type="text"
                    name="phone"
                    value={staffForm.phone}
                    onChange={handleStaffChange}
                    required
                  />
                </label>

                <label>
                  Role
                  <select
                    name="role"
                    value={staffForm.role}
                    onChange={handleStaffChange}
                    required
                  >
                    <option value="kitchen">Kitchen</option>
                    <option value="delivery">Delivery</option>
                    <option value="cashier">Cashier</option>
                  </select>
                </label>

                <label>
                  Status
                  <select
                    name="availability"
                    value={staffForm.availability}
                    onChange={handleStaffChange}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="offline">Offline</option>
                  </select>
                </label>

                {staffModalMode === "create" && (
                  <label>
                    Password
                    <input
                      type="password"
                      name="password"
                      value={staffForm.password}
                      onChange={handleStaffChange}
                      required
                    />
                  </label>
                )}
              </div>

              <div className="dashboard-modal-actions">
                <button type="button" className="dashboard-action-btn" onClick={closeModals}>
                  Cancel
                </button>

                <button type="submit" className="dashboard-action-btn">
                  {staffModalMode === "create" ? "Create Staff" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {passwordModalOpen && (
        <div className="dashboard-modal-backdrop" onClick={closeModals}>
          <div className="dashboard-modal dashboard-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <h2>Reset Password</h2>
              <button className="dashboard-modal-close" onClick={closeModals}>
                ×
              </button>
            </div>

            <form className="dashboard-modal-form" onSubmit={savePassword}>
              <label>
                New Password
                <input
                  type="password"
                  value={passwordForm}
                  onChange={(e) => setPasswordForm(e.target.value)}
                  required
                />
              </label>

              <div className="dashboard-modal-actions">
                <button type="button" className="dashboard-action-btn" onClick={closeModals}>
                  Cancel
                </button>

                <button type="submit" className="dashboard-action-btn">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
