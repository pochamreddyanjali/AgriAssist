import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import registerBg from "../assets/login.png";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert(response.data.message);

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${registerBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        width: "100vw",
        minHeight: "100vh",

        position: "fixed",
        top: 0,
        left: 0,

        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",

        paddingRight: "16%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "470px",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "28px",
          padding: "35px",
          boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
          transform: "translateX(-100px)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2E7D32",
            fontSize: "56px",
            margin: "0",
            lineHeight: "1.2",
          }}
        >
          AgriAssist
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginTop: "18px",
            marginBottom: "35px",
            fontSize: "18px",
          }}
        >
          Smart Farming for a Better Tomorrow
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
        />

        <button onClick={handleLogin} style={greenButton}>
          Login
        </button>
        <p>
          Don't have an account? <a href="/">Sign up</a>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const greenButton = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "10px",
  background: "#2E7D32",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "5px",
};

export default Login;
0