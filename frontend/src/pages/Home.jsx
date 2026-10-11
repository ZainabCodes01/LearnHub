import { getCourses } from "../services/courseService";
import React, { useEffect, useState } from "react";
import {
    BookOpen,
    Users,
    Award,
    GraduationCap,
    Star,
    ChevronRight,
    ArrowRight,
    Play,
    CheckCircle2,
    Menu,
    X,
    ShieldCheck,
    Laptop,
    Code2,
    Database,
    Terminal,
    Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function App() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [modalMessage, setModalMessage] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchCourses();
    }, []);

    const showNotification = (msg) => {
        setModalMessage(msg);
        setTimeout(() => setModalMessage(null), 3500);
    };


    const stats = [
        {
            label: "Active Courses",
            value: "450+",
            icon: BookOpen,
            color: "text-cyan",
            bg: "bg-cyan-soft",
        },
        {
            label: "Enrolled Students",
            value: "120,000+",
            icon: Users,
            color: "text-blue",
            bg: "bg-blue-soft",
        },
        {
            label: "Expert Instructors",
            value: "350+",
            icon: GraduationCap,
            color: "text-indigo",
            bg: "bg-indigo-soft",
        },
        {
            label: "Certificates Issued",
            value: "95,000+",
            icon: Award,
            color: "text-teal",
            bg: "bg-teal-soft",
        },
    ];

    const filteredCourses = courses.filter((course) => {
        const matchesCategory =
            activeCategory === "All" || course.category === activeCategory;

        const matchesSearch =
            course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <div className="app-page">
            {modalMessage && (
                <div className="notification-box">
                    <ShieldCheck size={20} className="text-cyan" />
                    <span>{modalMessage}</span>
                </div>
            )}

            {/* HERO */}
            <section id="home" className="hero-section">
                <div className="hero-pattern"></div>

                <div className="container-xl position-relative hero-content">
                    <div className="row align-items-center g-5">
                        <div className="col-12 col-lg-7 text-center text-lg-start">
                            <div className="hero-badge">
                                <span className="pulse-dot"></span>
                                Next-Gen Full Stack MERN Education
                            </div>

                            <h1 className="hero-title">
                                Learn Skills.
                                <br className="d-none d-sm-inline" />
                                <span>Build Your Future.</span>
                            </h1>

                            <p className="hero-description mx-auto mx-lg-0">
                                Master modern web development, backend engineering, and cloud
                                architecture with industry experts. Real-world MERN projects,
                                live mentorship, and accredited certifications.
                            </p>

                            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-lg-start gap-3 pt-2">
                                <a href="#courses" className="btn hero-primary-btn">
                                    Explore Courses
                                    <ArrowRight size={20} />
                                </a>

                                <button
                                    type="button"
                                    onClick={() => showNotification("Starting Free Trial...")}
                                    className="btn hero-secondary-btn"
                                >
                                    <Play size={16} fill="currentColor" />
                                    Start Learning
                                </button>
                            </div>

                            <div className="hero-benefits d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-lg-start gap-3 gap-lg-4">
                                <div>
                                    <CheckCircle2 size={19} />
                                    <span>Expert Instructors</span>
                                </div>
                                <div>
                                    <CheckCircle2 size={19} />
                                    <span>Lifetime Access</span>
                                </div>
                                <div>
                                    <CheckCircle2 size={19} />
                                    <span>Job Ready Certificate</span>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5">
                            <div className="workspace-wrap">
                                <div className="workspace-glow"></div>

                                <div className="workspace-card">
                                    <div className="workspace-top d-flex align-items-center justify-content-between">
                                        <div className="d-flex gap-2">
                                            <span className="window-dot red"></span>
                                            <span className="window-dot yellow"></span>
                                            <span className="window-dot green"></span>
                                        </div>

                                        <span className="workspace-file">
                                            mern_stack_workspace.js
                                        </span>
                                    </div>

                                    <div className="workspace-code">
                                        <div className="code-line">
                                            <span className="cyan-code">const</span>{" "}
                                            <span className="green-code">LearnHub</span> ={" "}
                                            <span className="yellow-code">require</span>
                                            {"("}'mern-mastery'{" );"}
                                        </div>

                                        <div className="code-block">
                                            <span className="purple-code">async function</span>{" "}
                                            <span className="blue-code">buildCareer</span>() {"{"}
                                            <br />
                                            &nbsp;&nbsp;
                                            <span className="cyan-code">await</span> LearnHub.
                                            <span className="yellow-code">enroll</span>
                                            {"({ stack: 'MERN' });"}
                                            <br />
                                            &nbsp;&nbsp;
                                            <span className="cyan-code">return</span> "Job Offer
                                            Secured! 🚀";
                                            <br />
                                            {"}"}
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-6">
                                            <div className="workspace-info">
                                                <Laptop size={30} className="text-cyan" />
                                                <div>
                                                    <small>Environment</small>
                                                    <strong>Cloud IDE</strong>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className="workspace-info">
                                                <Code2 size={30} className="text-teal" />
                                                <div>
                                                    <small>Curriculum</small>
                                                    <strong>Full-Stack</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section id="stats" className="stats-section">
                <div className="container-xl">
                    <div className="row g-4">

                        {stats.map((stat, idx) => {
                            const Icon = stat.icon;

                            return (
                                <div className="col-12 col-sm-6 col-lg-3" key={idx}>
                                    <div className="stat-card">
                                        <div className={`stat-icon ${stat.bg} ${stat.color}`}>
                                            <Icon size={28} />
                                        </div>

                                        <div>
                                            <div className="stat-value">{stat.value}</div>
                                            <div className="stat-label">{stat.label}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* COURSES */}
            <section id="courses" className="courses-section">
                <div className="container-xl">
                    <div className="row align-items-end g-4 mb-5">
                        <div className="col-12 col-lg">
                            <div className="section-eyebrow">Top Rated Programs</div>
                            <h2 className="section-title">Explore Popular Courses</h2>
                        </div>

                        <div className="col-12 col-lg-auto">
                            <div className="category-buttons d-flex flex-wrap gap-2">
                                {["All", "Web Development", "Frontend", "Backend", "Design"].map(
                                    (cat) => (
                                        <button
                                            type="button"
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`btn category-btn ${activeCategory === cat ? "active" : ""
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {loadingCourses ? (
                            <div className="col-12 text-center py-5">
                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Loading...
                                    </span>
                                </div>

                                <p className="text-muted mt-3">
                                    Loading courses...
                                </p>
                            </div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="col-12 text-center py-5">
                                <p className="text-muted">
                                    No courses available yet.
                                </p>
                            </div>
                        ) : (
                            filteredCourses.map((course) => (
                                <div
                                    className="col-12 col-md-6 col-lg-3"
                                    key={course._id}
                                >
                                    <div className="course-card h-100">
                                        <div className="course-image-wrap">
                                            <img
                                                src={
                                                    course.thumbnail ||
                                                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
                                                }
                                                alt={course.title}
                                                className="course-image"
                                            />

                                            <span className="course-category">
                                                {course.category}
                                            </span>

                                            <span className="course-badge">
                                                {course.level}
                                            </span>
                                        </div>

                                        <div className="course-body d-flex flex-column">
                                            <div>
                                                <div className="course-instructor">
                                                    Instructor:{" "}
                                                    <strong>
                                                        {course.instructor?.name ||
                                                            "LearnHub Instructor"}
                                                    </strong>
                                                </div>

                                                <h3 className="course-title">
                                                    {course.title}
                                                </h3>
                                                <p className="course-description">
                                                    {course.description.length > 20
                                                        ? course.description.slice(0, 20) + "..."
                                                        : course.description}
                                                </p>
                                            </div>

                                            <div className="course-bottom mt-auto">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="course-rating">
                                                        <Star
                                                            size={16}
                                                            fill="currentColor"
                                                        />
                                                        <span>
                                                            {course.averageRating || 0}
                                                        </span>
                                                    </div>

                                                    <div className="course-price">
                                                        ${course.price}
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => navigate(`/courses/${course._id}`)}
                                                    className="btn enroll-btn w-100 mt-3"
                                                >
                                                    <span>View Course</span>
                                                    <ChevronRight size={17} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="features-section">
                <div className="container-xl">
                    <div className="row align-items-center g-5">
                        <div className="col-12 col-lg-6">
                            <div className="why-badge">Why Choose LearnHub</div>

                            <h2 className="features-title">
                                Empowering Developers Worldwide with Real MERN Expertise.
                            </h2>

                            <p className="features-description">
                                Our curriculum is crafted by top industry engineers who build
                                production systems daily. You don't just learn syntax; you
                                architect real-time SaaS applications, master database design,
                                and deploy secure APIs.
                            </p>

                            <div className="feature-list">
                                {[
                                    {
                                        title: "Hands-On Full-Stack Projects",
                                        desc: "Build 10+ robust MERN SaaS applications from scratch.",
                                    },
                                    {
                                        title: "Interactive Code Assessments",
                                        desc: "Get instant feedback on your code quality and architecture.",
                                    },
                                    {
                                        title: "Career Mentorship & Guidance",
                                        desc: "Mock interviews, resume reviews, and direct hiring partner referrals.",
                                    },
                                ].map((item, idx) => (
                                    <div className="feature-item" key={idx}>
                                        <div className="feature-number">0{idx + 1}</div>
                                        <div>
                                            <h4>{item.title}</h4>
                                            <p>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div className="career-card">
                                <div className="career-glow"></div>

                                <div className="position-relative">
                                    <div className="career-icon">
                                        <Terminal size={25} />
                                    </div>

                                    <h3>Ready to accelerate your tech career?</h3>

                                    <p>
                                        Join thousands of graduates working at top global tech
                                        companies. Start your 14-day free trial today with
                                        unlimited access to all MERN stack courses.
                                    </p>

                                    <div className="row g-2 mt-3">
                                        <div className="col-12 col-sm">
                                            <input
                                                type="email"
                                                placeholder="Enter your work email"
                                                className="form-control career-input"
                                            />
                                        </div>

                                        <div className="col-12 col-sm-auto">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    showNotification("Thank you for subscribing!")
                                                }
                                                className="btn career-btn w-100"
                                            >
                                                Get Started
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer-section">
                <div className="container-xl">
                    <div className="row g-5 mb-5">
                        <div className="col-12 col-lg-5">
                            <div className="footer-brand">
                                <div className="footer-logo">L</div>
                                <span>
                                    Learn<span>Hub</span>
                                </span>
                            </div>

                            <p className="footer-description">
                                The premier full-stack MERN learning platform designed to help
                                developers master modern web architecture and launch
                                world-class tech careers.
                            </p>

                            <div className="footer-socials">
                                <Globe size={20} />
                                <Code2 size={20} />
                                <Database size={20} />
                            </div>
                        </div>

                        <div className="col-6 col-md-4 col-lg-2">
                            <h4>Platform</h4>
                            <ul>
                                <li><a href="#courses">Courses</a></li>
                                <li><a href="#features">Mentorship</a></li>
                                <li><a href="#stats">Certifications</a></li>
                                <li><a href="#home">Enterprise SaaS</a></li>
                            </ul>
                        </div>

                        <div className="col-6 col-md-4 col-lg-2">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="#home">Documentation</a></li>
                                <li><a href="#home">API Reference</a></li>
                                <li><a href="#home">Community Forums</a></li>
                                <li><a href="#home">Blog & Tutorials</a></li>
                            </ul>
                        </div>

                        <div className="col-12 col-md-4 col-lg-3">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#home">About Us</a></li>
                                <li>
                                    <a href="#home">
                                        Careers{" "}
                                        <span className="hiring-badge">We're Hiring</span>
                                    </a>
                                </li>
                                <li><a href="#home">Privacy Policy</a></li>
                                <li><a href="#home">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>
                            &copy; {new Date().getFullYear()} LearnHub Technologies Inc. All
                            rights reserved.
                        </p>

                        <div>
                            <a href="#home">Privacy</a>
                            <a href="#home">Terms</a>
                            <a href="#home">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
