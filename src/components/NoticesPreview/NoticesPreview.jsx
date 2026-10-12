import { Link } from "react-router-dom";
import { FiFileText, FiBookOpen, FiAward } from "react-icons/fi";
import NoticeCard from "../NoticeCard/NoticeCard";
import "./NoticesPreview.css";

function NoticesPreview() {
  const notices = [
    {
      icon: <FiFileText />,
      title: "Mid Semester Examination Schedule",
      date: "15 Sept",
      category: "Exam",
      summary:
        "Mid-semester exams begin next week. Check department-wise timings and carry your college ID."
    },
    {
      icon: <FiBookOpen />,
      title: "Library Timings Updated",
      date: "12 Sept",
      category: "Library",
      summary:
        "The central library will remain open till 8 PM on weekdays for extended study hours."
    },
    {
      icon: <FiAward />,
      title: "Scholarship Verification Deadline",
      date: "10 Sept",
      category: "Scholarship",
      summary:
        "Complete document verification before the announced deadline to remain eligible."
    }
  ];

  return (
    <section className="notices-preview section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag fade-up">Latest Updates</span>

          <h2 className="fade-up delay-1">Recent Notices</h2>

          <p className="fade-up delay-2">
            Stay updated with the latest college announcements,
            summarized instantly by AI.
          </p>
        </div>

        <div className="notices-grid">
          {notices.map((notice, index) => (
            <div
              key={index}
              className={`notice-item fade-up delay-${Math.min(index + 1, 3)}`}
            >
              <NoticeCard {...notice} />
            </div>
          ))}
        </div>

        <div className="view-all fade-up delay-3">
          <Link to="/notices">View All Notices →</Link>
        </div>
      </div>
    </section>
  );
}

export default NoticesPreview;