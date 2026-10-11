
import { useEffect, useMemo, useState } from "react";
import { getUsers, updateUser, deleteUser } from "../services/userService";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [updatingId, setUpdatingId] = useState("");
    const [deletingId, setDeletingId] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Token not found. Please login again.");
            }

            const response = await getUsers(token);

            const userList = Array.isArray(response)
                ? response
                : response?.users ||
                response?.data?.users ||
                response?.data ||
                [];

            setUsers(Array.isArray(userList) ? userList : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load users."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const name = user.name || user.fullName || "";
            const email = user.email || "";
            const role = user.role || "Student";

            const matchesSearch = `${name} ${email}`
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesRole =
                roleFilter === "All" ||
                role.toLowerCase() === roleFilter.toLowerCase();

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    const handleRoleChange = async (user, newRole) => {
        if (!newRole || newRole === user.role) return;

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Token not found. Please login again.");
            return;
        }

        setUpdatingId(user._id);
        setError("");
        setMessage("");

        try {
            await updateUser(user._id, { role: newRole }, token);

            setUsers((currentUsers) =>
                currentUsers.map((item) =>
                    item._id === user._id ? { ...item, role: newRole } : item
                )
            );

            setMessage(`${user.name || user.email}'s role updated to ${newRole}.`);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to update user role."
            );
            await fetchUsers();
        } finally {
            setUpdatingId("");
        }
    };


    const handleDelete = async () => {
        if (!selectedUser) return;

        const user = selectedUser;
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Token not found. Please login again.");
            return;
        }

        setDeletingId(user._id);
        setError("");
        setMessage("");

        try {
            await deleteUser(user._id, token);

            setUsers((currentUsers) =>
                currentUsers.filter((item) => item._id !== user._id)
            );

            setSelectedUser(null);
            setMessage("User deleted successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to delete user."
            );
        } finally {
            setDeletingId("");
        }
    };


    return (
        <div className="container-fluid py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">Users Management</h2>
                    <p className="text-muted mb-0">
                        View and manage all LearnHub users.
                    </p>
                </div>

                <span className="badge bg-dark fs-6 px-3 py-2">
                    Total Users: {users.length}
                </span>
            </div>

            {message && (
                <div className="alert alert-success alert-dismissible fade show">
                    {message}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessage("")}
                        aria-label="Close"
                    />
                </div>
            )}

            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError("")}
                        aria-label="Close"
                    />
                </div>
            )}

            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="row g-3 mb-4">
                        <div className="col-md-8">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="All">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Instructor">Instructor</option>
                                <option value="Student">Student</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status" />
                            <p className="text-muted mt-2 mb-0">Loading users...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Current Role</th>
                                        <th>Change Role</th>
                                        <th>User ID</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user, index) => (
                                            <tr key={user._id || user.id || index}>
                                                <td>{index + 1}</td>
                                                <td className="fw-semibold">
                                                    {user.name || user.fullName || "N/A"}
                                                </td>
                                                <td>{user.email || "N/A"}</td>
                                                <td>
                                                    <span
                                                        className={`badge bg-${user.role === "Admin"
                                                            ? "danger"
                                                            : user.role === "Instructor"
                                                                ? "primary"
                                                                : "success"
                                                            }`}
                                                    >
                                                        {user.role || "Student"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        value={user.role || "Student"}
                                                        disabled={
                                                            updatingId === user._id ||
                                                            deletingId === user._id
                                                        }
                                                        onChange={(e) =>
                                                            handleRoleChange(user, e.target.value)
                                                        }
                                                    >
                                                        <option value="Student">Student</option>
                                                        <option value="Instructor">Instructor</option>
                                                        <option value="Admin">Admin</option>
                                                    </select>

                                                    {updatingId === user._id && (
                                                        <small className="text-muted">
                                                            Updating...
                                                        </small>
                                                    )}
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {user._id || user.id || "N/A"}
                                                    </small>
                                                </td>
                                                <td>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        disabled={
                                                            deletingId === user._id ||
                                                            updatingId === user._id
                                                        }
                                                        onClick={() => setSelectedUser(user)}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted py-4">
                                                {users.length === 0
                                                    ? "No users found."
                                                    : "No users match your search."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="text-muted small mt-3">
                            Showing {filteredUsers.length} of {users.length} users
                        </div>
                    )}
                </div>
            </div>

            {selectedUser && (
                <div
                    className="modal d-block"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="deleteUserTitle"
                    style={{
                        backgroundColor: "rgba(15, 23, 42, 0.6)",
                        backdropFilter: "blur(4px)",
                        zIndex: 1055,
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div
                            className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
                            style={{ boxShadow: "0 24px 70px rgba(1, 28, 64, 0.25)" }}
                        >

                            <div
                                className="text-white text-center p-4"
                                style={{
                                    background: "linear-gradient(135deg, #023859 0%, #011C40 55%, #54ACBF 100%)",
                                }}
                            >
                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{
                                        width: "68px",
                                        height: "68px",
                                        background: "rgba(255,255,255,0.14)",
                                        border: "1px solid rgba(255,255,255,0.3)",
                                    }}
                                >
                                    <icon name="user-round-x" size="2xl" color="#FFFFFF" />
                                </div>

                                <h4 className="fw-bold mb-1">Delete User?</h4>
                                <p className="mb-0 small" style={{ color: "#D8EDF5" }}>
                                    Please review this action before proceeding.
                                </p>
                            </div>

                            <div className="modal-body p-4 text-center">

                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                                    style={{
                                        width: "76px",
                                        height: "76px",
                                        backgroundColor: "#FEE2E2",
                                        color: "#DC2626",
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="34"
                                        height="34"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M3 6h18" />
                                        <path d="M8 6V4h8v2" />
                                        <path d="m19 6-1 14H6L5 6" />
                                        <path d="M10 11v5M14 11v5" />
                                    </svg>
                                </div>

                                <div className="bg-light rounded-3 p-3 mb-4 text-start">
                                    <div className="fw-semibold text-dark">
                                        {selectedUser.name || "Unnamed User"}
                                    </div>
                                    <div className="small text-secondary mt-1">
                                        {selectedUser.email || "No email available"}
                                    </div>
                                    <div className="mt-2">
                                        <span className="badge bg-secondary">
                                            {selectedUser.role || "Student"}
                                        </span>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center gap-2 flex-wrap">
                                    <button
                                        type="button"
                                        className="btn btn-light border px-4"
                                        disabled={Boolean(deletingId)}
                                        onClick={() => setSelectedUser(null)}
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="button"
                                        className="btn text-white px-4 fw-semibold"
                                        style={{
                                            background: "linear-gradient(135deg, #023859, #011C40)",
                                            border: "none",
                                            boxShadow: "0 4px 12px rgba(1, 28, 64, 0.22)",
                                        }}
                                        disabled={Boolean(deletingId)}
                                        onClick={handleDelete}
                                    >
                                        {deletingId ? "Deleting..." : "Yes, Delete User"}
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminUsers;
