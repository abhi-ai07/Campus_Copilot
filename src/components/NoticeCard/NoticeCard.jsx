import { FiArrowRight } from "react-icons/fi";
import "./NoticeCard.css";

function NoticeCard({ icon, title, date, category, summary }) {
  return (
    <div className="notice-card">

      <div className="notice-icon">
        {icon}
      </div>

      <div className="notice-top">
        <span className="notice-badge">{category}</span>
        <span className="notice-date">{date}</span>
      </div>

      <h3>{title}</h3>

      <p>{summary}</p>

      <button className="notice-link">
        Read Summary
        <FiArrowRight />
      </button>

    </div>
  );
}

export default NoticeCard;