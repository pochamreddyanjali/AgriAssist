import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import registerBg from "../assets/register.png";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // Send OTP
  // ===============================
  const sendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        formData,
      );

      alert(response.data.message);
      setOtpSent(true);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    }
  };

  // ===============================
  // Verify OTP
  // ===============================
  const verifyOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email: formData.email,
          otp,
        },
      );

      alert(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      alert(error.response?.data?.message || "OTP Verification Failed");
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
          width: "430px",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "22px",
          padding: "35px",
          boxShadow: "0 20px 45px rgba(0,0,0,0.18)",

          transform: "translateX(-120px)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2E7D32",
            fontSize: "58px",
            fontWeight: "700",
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
            fontSize: "20px",
            marginTop: "18px",
            marginBottom: "35px",
            letterSpacing: "0.5px",
          }}
        >
          Smart Farming for a Better Tomorrow
        </p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
        />

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

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          style={inputStyle}
        />

        <button onClick={sendOTP} style={greenButton}>
          Send OTP
        </button>

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={inputStyle}
            />

            <button onClick={verifyOTP} style={greenButton}>
              Verify OTP & Register
            </button>
          </>
        )}
        <p>
          Have an account? <a href="/login">Sign in</a>
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
  marginBottom: "18px",
};

export default Register;
