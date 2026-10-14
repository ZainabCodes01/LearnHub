
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { enrollCourse } from "../services/enrollmentService";
import { useAuth } from "../context/AuthContext";

function DemoPayment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const course = state?.course;
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!course) {
    return (
      <div className="container mt-5">
        <h3>Course information missing</h3>
        <p>Please open the course page and try again.</p>
        <button onClick={() => navigate("/courses")}>
          Browse Courses
        </button>
      </div>
    );
  }

  const handlePayment = async () => {
    if (user?.role !== "Student") {
      setError("Only students can enroll in courses.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // DEMO ONLY: No real payment is processed.
      await enrollCourse(course._id, token);

      alert("Demo payment successful! You are enrolled.");
      navigate("/my-courses");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to complete demo enrollment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <h2>Checkout</h2>
        <p className="text-muted">Demo payment — no real money will be charged.</p>

        <hr />

        <h4>{course.title || course.name}</h4>
        <h3 className="my-3">
          Course Price: {course.price > 0 ? `$${course.price}` : "Free"}
        </h3>

        <h5 className="mt-3">Select Demo Payment Method</h5>

        <label className="d-block my-2">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={method === "card"}
            onChange={(e) => setMethod(e.target.value)}
          />{" "}
          Credit / Debit Card (Demo)
        </label>

        <label className="d-block my-2">
          <input
            type="radio"
            name="paymentMethod"
            value="wallet"
            checked={method === "wallet"}
            onChange={(e) => setMethod(e.target.value)}
          />{" "}
          Digital Wallet (Demo)
        </label>

        <label className="d-block my-2">
          <input
            type="radio"
            name="paymentMethod"
            value="bank"
            checked={method === "bank"}
            onChange={(e) => setMethod(e.target.value)}
          />{" "}
          Bank Transfer (Demo)
        </label>

        {error && <p className="text-danger mt-3">{error}</p>}

        <button
          className="btn btn-primary mt-3"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Demo Payment"}
        </button>

        <button
          className="btn btn-outline-secondary mt-2"
          onClick={() => navigate(`/courses/${course._id}`)}
          disabled={loading}
        >
          Back to Course
        </button>
      </div>
    </div>
  );
}

export default DemoPayment;
