import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Weather from "./pages/Weather";

import CommunityDashboard from "./pages/CommunityDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/weather" element={<Weather />} />
        <Route path="/" element={<Register />} />

        <Route path="/login" element={<Login />} />
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
             path="/community"
               element={<CommunityDashboard />}
                 />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
