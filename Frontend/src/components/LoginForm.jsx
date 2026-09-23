import { useEffect, useState, useContext } from "react";
import { MyContext } from "../MyContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "https://stackmind-4yin.onrender.com";

const LoginForm = () => {
  const { loginUser, setShowAuthModal, authMode, setAuthMode } =
    useContext(MyContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // const url =
    //   authMode === "Login"
    //     ? "https://stackmind-4yin.onrender.com/api/auth/login"
    //     : "https://stackmind-4yin.onrender.com/api/auth/signup";

    const url =
      authMode === "Login"
        ? `${API_URL}/api/auth/login`
        : `${API_URL}/api/auth/signup`;

    const bodyData =
      authMode === "Login" ? { email, password } : { name, email, password };

    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        loginUser(data.user, data.token);
      } else {
        setErrorMsg(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button
          type="button"
          onClick={() => setShowAuthModal(false)}
          className="close-btn"
        >
          ✕
        </button>

        {/* Branded header */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <i className="fa-solid fa-brain"></i>
          </div>
        </div>

        <h2 className="auth-title">
          {authMode === "Login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="auth-subtitle">
          {authMode === "Login"
            ? "Log in to continue to Stack Mind"
            : "Join Stack Mind and start chatting"}
        </p>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {authMode === "Sign Up" && (
            <div className="auth-input-wrapper">
              <i className="fa-solid fa-user auth-input-icon"></i>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                className="auth-input"
              />
            </div>
          )}

          <div className="auth-input-wrapper">
            <i className="fa-solid fa-envelope auth-input-icon"></i>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="auth-input"
            />
          </div>

          <div className="auth-input-wrapper">
            <i className="fa-solid fa-lock auth-input-icon"></i>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                authMode === "Login" ? "current-password" : "new-password"
              }
              required
              className="auth-input auth-input-password"
            />
            <i
              className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} auth-eye-toggle`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span className="auth-btn-spinner"></span>
            ) : authMode === "Login" ? (
              "Log In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          {authMode === "Login" ? (
            <p>
              Don't have an account?{" "}
              <span
                className="auth-link"
                onClick={() => setAuthMode("Sign Up")}
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span className="auth-link" onClick={() => setAuthMode("Login")}>
                Log In
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;