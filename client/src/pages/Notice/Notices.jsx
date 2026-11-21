import { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiBell,
  FiCalendar,
  FiAlertCircle,
  FiRefreshCw,
  FiFileText,
} from "react-icons/fi";
import "./Notices.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Academic",
    "Examination",
    "Events",
    "Holiday",
    "Placement",
    "General",
  ];

  // Fetch notices from backend
  const fetchNotices = async () => {
    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/notices`);

      if (!response.ok) {
        throw new Error("Unable to fetch notices.");
      }

      const result = await response.json();

      setNotices(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial API call
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchNotices();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // Manual refresh
  const handleRefresh = async () => {
    setLoading(true);
    await fetchNotices();
  };

  // Search and category filtering
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      const matchesCategory =
        activeCategory === "All" || notice.category === activeCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        notice.title?.toLowerCase().includes(searchText) ||
        notice.description?.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [notices, search, activeCategory]);

  // Format published date
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="notices-page">
      {/* Page Heading */}
      <section className="notices-hero">
        <div className="notices-heading">
          <span className="notices-eyebrow">
            <FiBell />
            CAMPUS UPDATES
          </span>

          <h1>College Notices</h1>

          <p>
            Stay updated with the latest announcements, examination schedules
            and important college updates.
          </p>
        </div>

        <div className="notices-total">
          <div className="notices-total-icon">
            <FiFileText />
          </div>

          <div>
            <strong>{notices.length}</strong>
            <span>Total Notices</span>
          </div>
        </div>
      </section>

      {/* Search and Refresh */}
      <section className="notices-toolbar">
        <div className="notices-search">
          <FiSearch />

          <input
            type="text"
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="notices-refresh"
          onClick={handleRefresh}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? "refresh-spin" : ""} />
          Refresh
        </button>
      </section>

      {/* Category Filters */}
      <section className="notices-filters">
        <div className="notices-filter-label">Filter by category</div>

        <div className="notices-category-list">
          {categories.map((category) => (
            <button
              key={category}
              className={`notices-category ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Notices Results */}
      <section className="notices-results">
        <div className="notices-results-heading">
          <div>
            <h2>Latest Updates</h2>
            <p>{filteredNotices.length} notices found</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="notices-message">
            <div className="notices-loader"></div>
            <p>Loading college notices...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="notices-message notices-error">
            <FiAlertCircle />

            <p>{error}</p>

            <button onClick={handleRefresh}>Try Again</button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredNotices.length === 0 && (
          <div className="notices-message">
            <FiFileText />

            <h3>No notices found</h3>

            <p>Try changing your search or selecting another category.</p>
          </div>
        )}

        {/* Notice Cards */}
        {!loading && !error && filteredNotices.length > 0 && (
          <div className="notices-grid">
            {filteredNotices.map((notice) => (
              <article className="notice-card" key={notice._id}>
                <div className="notice-card-top">
                  <span className="notice-category-badge">
                    {notice.category}
                  </span>

                  <span
                    className={`notice-priority ${
                      notice.priority?.toLowerCase() || "medium"
                    }`}
                  >
                    {notice.priority || "Medium"} Priority
                  </span>
                </div>

                <h3>{notice.title}</h3>

                <p className="notice-description">{notice.description}</p>

                <div className="notice-card-footer">
                  <span>
                    <FiCalendar />
                    {formatDate(notice.publishedAt)}
                  </span>

                  {notice.attachmentUrl && (
                    <a
                      href={notice.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Attachment
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Notices;
