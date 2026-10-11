
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    BookOpen,
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    RefreshCw,
    AlertCircle,
    GraduationCap,
    Users,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/courses";

const categories = [
    "Web Development",
    "Data Science",
    "Mobile Development",
    "UI/UX Design",
    "Cloud Computing",
    "Cybersecurity",
];

const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

const emptyForm = {
    title: "",
    description: "",
    category: "Web Development",
    price: "0",
    thumbnail: "",
    videoUrl: "",
    level: "All Levels",
};

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const token = localStorage.getItem("token");

    const fetchCourses = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.get(API_URL);
            const data = response.data;

            setCourses(
                Array.isArray(data)
                    ? data
                    : data.courses || data.data || []
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Courses load nahi ho sake. Backend check karo."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                course.title?.toLowerCase().includes(searchText) ||
                course.category?.toLowerCase().includes(searchText) ||
                course.instructor?.name?.toLowerCase().includes(searchText) ||
                course.instructor?.email?.toLowerCase().includes(searchText);

            const matchesCategory =
                categoryFilter === "All" ||
                course.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [courses, search, categoryFilter]);

    const openAddForm = () => {
        setEditingCourse(null);
        setForm(emptyForm);
        setError("");
        setMessage("");
        setShowForm(true);
    };

    const openEditForm = (course) => {
        setEditingCourse(course);
        setForm({
            title: course.title || "",
            description: course.description || "",
            category: course.category || "Web Development",
            price: String(course.price ?? 0),
            thumbnail: course.thumbnail || "",
            level: course.level || "All Levels",
        });
        setError("");
        setMessage("");
        setShowForm(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!token) {
            setError("Login session nahi mili. Dobara login karo.");
            return;
        }

        setSaving(true);

        try {
            const { videoUrl, ...courseFields } = form;

            const payload = {
                ...courseFields,
                price: Number(form.price),
            };

            if (editingCourse) {
                const response = await axios.put(
                    `${API_URL}/${editingCourse._id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const updatedCourse =
                    response.data.course || response.data;

                setCourses((prev) =>
                    prev.map((course) =>
                        course._id === editingCourse._id
                            ? { ...course, ...updatedCourse }
                            : course
                    )
                );

                setMessage("Course successfully update ho gaya!");
            } else {
                const response = await axios.post(API_URL, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const newCourse = response.data.course || response.data;

                setCourses((prev) => [newCourse, ...prev]);

                if (videoUrl && videoUrl.trim()) {
                    try {
                        await axios.post(
                            "http://localhost:5000/api/lessons",
                            {
                                course: newCourse._id,
                                title: `${newCourse.title} Lecture`,
                                description: "",
                                videoUrl: videoUrl.trim(),
                                duration: 0,
                                order: 1,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        setMessage(
                            "Course aur video successfully save ho gaye!"
                        );
                    } catch (videoErr) {
                        setMessage(
                            "Course add ho gaya, lekin video save nahi hui. Video URL aur backend permissions check karo."
                        );
                    }
                } else {
                    setMessage("New course successfully add ho gaya!");
                }
            }

            setShowForm(false);
            setEditingCourse(null);
            setForm(emptyForm);
            await fetchCourses();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Course save nahi ho saka. Details check karo."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCourse) return;

        if (!token) {
            setError("Login session nahi mili. Dobara login karo.");
            setSelectedCourse(null);
            return;
        }

        setDeleting(true);
        setError("");
        setMessage("");

        try {
            await axios.delete(`${API_URL}/${selectedCourse._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCourses((prev) =>
                prev.filter((course) => course._id !== selectedCourse._id)
            );
            setSelectedCourse(null);
            setMessage("Course successfully delete ho gaya!");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Course delete nahi ho saka."
            );
            setSelectedCourse(null);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-vh-100 bg-light">
            <div className="container-fluid px-3 px-md-4 py-4">
                {/* Header */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div
                                className="rounded-3 p-2 text-white"
                                style={{ background: "#023859" }}
                            >
                                <BookOpen size={25} />
                            </div>
                            <span className="text-secondary small fw-semibold">
                                LEARNHUB ADMIN
                            </span>
                        </div>
                        <h1 className="h3 fw-bold mb-1">Courses Management</h1>
                        <p className="text-secondary mb-0">
                            Add, view, update and manage all courses.
                        </p>
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-secondary rounded-3"
                            onClick={fetchCourses}
                            disabled={loading}
                        >
                            <RefreshCw size={16} className="me-2" />
                            Refresh
                        </button>
                        <button
                            className="btn text-white rounded-3"
                            style={{
                                background:
                                    "linear-gradient(135deg, #023859, #011C40, #54ACBF)",
                            }}
                            onClick={openAddForm}
                        >
                            <Plus size={18} className="me-2" />
                            Add Course
                        </button>
                    </div>
                </div>

                {message && (
                    <div className="alert alert-success rounded-3">{message}</div>
                )}

                {error && (
                    <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2">
                        <AlertCircle size={19} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Summary */}
                <div className="row g-3 mb-4">
                    <div className="col-12 col-sm-6 col-xl-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4 d-flex align-items-center gap-3">
                                <div
                                    className="rounded-4 p-3"
                                    style={{ background: "#e0f2fe", color: "#023859" }}
                                >
                                    <BookOpen size={27} />
                                </div>
                                <div>
                                    <p className="text-secondary mb-1">Total Courses</p>
                                    <h3 className="fw-bold mb-0">{courses.length}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4 d-flex align-items-center gap-3">
                                <div
                                    className="rounded-4 p-3"
                                    style={{ background: "#dcfce7", color: "#166534" }}
                                >
                                    <GraduationCap size={27} />
                                </div>
                                <div>
                                    <p className="text-secondary mb-1">Categories Used</p>
                                    <h3 className="fw-bold mb-0">
                                        {new Set(courses.map((c) => c.category)).size}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-xl-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4 d-flex align-items-center gap-3">
                                <div
                                    className="rounded-4 p-3"
                                    style={{ background: "#f3e8ff", color: "#6b21a8" }}
                                >
                                    <Users size={27} />
                                </div>
                                <div>
                                    <p className="text-secondary mb-1">Enrolled Students</p>
                                    <h3 className="fw-bold mb-0">
                                        {courses.reduce(
                                            (sum, course) =>
                                                sum +
                                                Number(course.enrolledStudentsCount || 0),
                                            0
                                        )}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="card border-0 shadow-sm rounded-4 mb-4">
                    <div className="card-body p-3">
                        <div className="row g-3">
                            <div className="col-12 col-md-7">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <Search size={18} />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0"
                                        placeholder="Search title, category or instructor..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-5">
                                <select
                                    className="form-select"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    <option value="All">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Table */}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="card-header bg-white border-0 p-4">
                        <h2 className="h5 fw-bold mb-1">All Courses</h2>
                        <p className="text-secondary small mb-0">
                            Showing {filteredCourses.length} of {courses.length} courses
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: "#023859" }} />
                            <p className="text-secondary mt-3 mb-0">Loading courses...</p>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-5 px-3">
                            <BookOpen size={42} className="text-secondary mb-3" />
                            <h3 className="h5 fw-bold">No courses found</h3>
                            <p className="text-secondary mb-3">
                                Add a course or change your search filters.
                            </p>
                            <button className="btn btn-primary" onClick={openAddForm}>
                                <Plus size={17} className="me-2" />
                                Add First Course
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-4 py-3">Course</th>
                                        <th className="py-3">Instructor</th>
                                        <th className="py-3">Category / Level</th>
                                        <th className="py-3">Price</th>
                                        <th className="py-3">Students</th>
                                        <th className="text-end px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCourses.map((course) => (
                                        <tr key={course._id}>
                                            <td className="px-4 py-3" style={{ minWidth: 240 }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <img
                                                        src={
                                                            course.thumbnail ||
                                                            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200"
                                                        }
                                                        alt={course.title}
                                                        style={{
                                                            width: 66,
                                                            height: 52,
                                                            objectFit: "cover",
                                                            borderRadius: 10,
                                                        }}
                                                        onError={(e) => {
                                                            e.currentTarget.style.visibility = "hidden";
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="fw-semibold">{course.title}</div>
                                                        <small className="text-secondary">
                                                            ID: {course._id?.slice(-8)}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ minWidth: 170 }}>
                                                <div className="fw-semibold">
                                                    {course.instructor?.name || "Not available"}
                                                </div>
                                                <small className="text-secondary">
                                                    {course.instructor?.email || ""}
                                                </small>
                                            </td>
                                            <td style={{ minWidth: 150 }}>
                                                <div className="small fw-semibold">
                                                    {course.category}
                                                </div>
                                                <span className="badge bg-light text-dark border mt-1">
                                                    {course.level || "All Levels"}
                                                </span>
                                            </td>
                                            <td className="fw-semibold">
                                                ${Number(course.price || 0).toFixed(2)}
                                            </td>
                                            <td>
                                                <span className="badge rounded-pill bg-info-subtle text-info-emphasis ms-3">
                                                    {course.enrolledStudentsCount || 0}
                                                </span>
                                            </td>
                                            <td className="text-end px-4 " style={{ minWidth: 150 }}>
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    title="Edit course"
                                                    onClick={() => openEditForm(course)}
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Delete course"
                                                    onClick={() => setSelectedCourse(course)}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add / Edit Modal */}
            {showForm && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                    style={{
                        background: "rgba(1, 28, 64, 0.65)",
                        backdropFilter: "blur(5px)",
                        zIndex: 1050,
                        overflowY: "auto",
                    }}
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget && !saving) {
                            setShowForm(false);
                        }
                    }}
                >
                    <div
                        className="bg-white rounded-4 shadow-lg w-100"
                        style={{ maxWidth: 650, maxHeight: "95vh", overflowY: "auto" }}
                    >
                        <div
                            className="p-4 text-white d-flex justify-content-between align-items-center"
                            style={{
                                background:
                                    "linear-gradient(135deg, #023859, #011C40, #54ACBF)",
                            }}
                        >
                            <div>
                                <h2 className="h5 fw-bold mb-1">
                                    {editingCourse ? "Edit Course" : "Add New Course"}
                                </h2>
                                <p className="small mb-0 text-white-50">
                                    Enter the course details below.
                                </p>
                            </div>
                            <button
                                className="btn btn-sm text-white"
                                onClick={() => setShowForm(false)}
                                disabled={saving}
                                aria-label="Close form"
                            >
                                <X size={23} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4">
                            {error && (
                                <div className="alert alert-danger rounded-3">{error}</div>
                            )}

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Course Title *</label>
                                <input
                                    className="form-control"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    maxLength={100}
                                    required
                                    placeholder="e.g. Full Stack Web Development"
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Description *
                                </label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    maxLength={2000}
                                    rows={4}
                                    required
                                    placeholder="Describe what students will learn..."
                                />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">Category *</label>
                                    <select
                                        className="form-select"
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-12 col-md-6">
                                    <label className="form-label fw-semibold">Level</label>
                                    <select
                                        className="form-select"
                                        name="level"
                                        value={form.level}
                                        onChange={handleChange}
                                    >
                                        {levels.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Price ($) *</label>
                                <input
                                    className="form-control"
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Thumbnail Image URL
                                </label>
                                <input
                                    className="form-control"
                                    type="url"
                                    name="thumbnail"
                                    value={form.thumbnail}
                                    onChange={handleChange}
                                    placeholder="https://example.com/course-image.jpg"
                                />
                                <small className="text-secondary">
                                    Optional. Leave blank to use the default image.
                                </small>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Video Lecture URL
                                </label>
                                <input
                                    className="form-control"
                                    type="url"
                                    name="videoUrl"
                                    value={form.videoUrl || ""}
                                    onChange={handleChange}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                />
                                <small className="text-secondary">
                                    Optional. Add a YouTube video link for this course.
                                </small>
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-light border rounded-3"
                                    onClick={() => setShowForm(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn text-white rounded-3"
                                    disabled={saving}
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #023859, #011C40, #54ACBF)",
                                    }}
                                >
                                    {saving ? "Saving..." : editingCourse ? "Save Changes" : "Add Course"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {selectedCourse && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
                    style={{
                        background: "rgba(1, 28, 64, 0.65)",
                        backdropFilter: "blur(5px)",
                        zIndex: 1060,
                    }}
                >
                    <div
                        className="bg-white rounded-4 shadow-lg w-100 text-center p-4"
                        style={{ maxWidth: 430 }}
                    >
                        <div
                            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                            style={{
                                width: 68,
                                height: 68,
                                background: "linear-gradient(135deg, #023859, #54ACBF)",
                                color: "#fff",
                            }}
                        >
                            <Trash2 size={30} />
                        </div>
                        <h2 className="h5 fw-bold mb-2">Delete Course?</h2>
                        <p className="text-secondary mb-1">
                            Are you sure you want to delete
                        </p>
                        <p className="fw-bold mb-4">{selectedCourse.title}?</p>
                        <div className="d-flex justify-content-center gap-2">
                            <button
                                className="btn btn-light border rounded-3 px-4"
                                onClick={() => setSelectedCourse(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger rounded-3 px-4"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
