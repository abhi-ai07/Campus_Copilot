import { Link } from "react-router-dom";
import { FiMail, FiGithub } from "react-icons/fi";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">

        <div className="footer-brand">
          <h2>CampusCopilot</h2>
          <p>
            AI-powered college assistant helping students understand notices,
            ERP guidance, scholarships and official college information.
          </p>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/notices">Notices</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="footer-column">
          <h4>Resources</h4>
          <Link to="/chat">ERP Guidance</Link>
          <Link to="/chat">Library Rules</Link>
          <Link to="/chat">Scholarships</Link>
          <Link to="/chat">Exam Info</Link>
        </div>

        <div className="footer-column">
          <h4>Contact</h4>

          <div className="footer-item">
            <FiMail />
            <span>support@campuscopilot.ai</span>
          </div>

          <div className="footer-item">
            <FiGithub />
            <span>GitHub Repository</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 CampusCopilot. BCA 5th Semester Project.
      </div>
    </footer>
  );
}

export default Footer;