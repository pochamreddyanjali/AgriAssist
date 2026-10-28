import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dash">
      <header className="dash-head">
        <h1>Welcome to AgriAssist</h1>
        <p>Choose a tool to get started.</p>
      </header>

      <div className="dash-grid">
        <Link to="/weather" className="dash-card">
          <svg
            className="dash-card-icon"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v1.5M4.2 6.2l1 1M19.8 6.2l-1 1M3 12h1.5" />
            <path d="M8 12a4 4 0 0 1 7.2-2.4" />
            <path d="M7 20a3.5 3.5 0 0 1-.4-6.98A5 5 0 0 1 16.2 12.5 3.75 3.75 0 0 1 16.5 20H7z" />
          </svg>

          <h2>Weather</h2>
          <p>Current conditions and a 5-day forecast for your location.</p>

          <span className="dash-card-cta">
            View forecast
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      </div>
      <div className="dash-grid">
        <Link to="/community" className="dash-card">
          <svg
            className="dash-card-icon"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v1.5M4.2 6.2l1 1M19.8 6.2l-1 1M3 12h1.5" />
            <path d="M8 12a4 4 0 0 1 7.2-2.4" />
            <path d="M7 20a3.5 3.5 0 0 1-.4-6.98A5 5 0 0 1 16.2 12.5 3.75 3.75 0 0 1 16.5 20H7z" />
          </svg>

          <h2>Community Page</h2>
          <p>Connect with other farmers and share your knowledge.</p>

          <span className="dash-card-cta">
            Join Community
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
